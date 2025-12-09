import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  User,
  UserStatus,
  Prisma,
  BuildingMember,
} from '@prisma/client';
import { UserRole } from '../../common/constants/roles.constants';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserQueryDto,
} from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { hasRolePermission } from '../../common/constants/roles.constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   * SECURITY: Only SUPER_ADMIN can create users directly
   */
  async create(createDto: CreateUserDto, createdById: string): Promise<User> {
    // Verify creator is SUPER_ADMIN
    const creator = await this.prisma.user.findUnique({
      where: { id: createdById },
    });

    if (!creator || (!creator.isSuperAdmin)) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    // Check if user with this phone already exists
    const existing = await this.prisma.user.findUnique({
      where: { phone: createDto.phone },
    });

    if (existing && existing.deletedAt === null) {
      throw new ConflictException(MESSAGES.USER.PHONE_EXISTS);
    }

    // Create user
    return this.prisma.user.create({
      data: {
        phone: createDto.phone,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        email: createDto.email,
        nationalId: createDto.nationalId,
        status: createDto.status || UserStatus.ACTIVE,
        isSuperAdmin: false,
      },
    });
  }

  /**
   * Find all users with pagination and filtering
   * SECURITY: Only SUPER_ADMIN and MANAGER can list users
   */
  async findAll(
    query: UserQueryDto,
    requestingUserId: string,
  ): Promise<PaginatedResponseDto<User>> {
    // Verify requesting user has permission
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || !requester.isSuperAdmin) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null, // Exclude soft-deleted users
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }

  /**
   * Get user's buildings and roles
   */
  async getUserBuildings(userId: string): Promise<any[]> {
    const memberships = await this.prisma.buildingMember.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        building: {
          select: { id: true, name: true, address: true, city: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((m) => ({
      id: m.building.id,
      name: m.building.name,
      address: m.building.address,
      city: m.building.city,
      role: m.role,
      status: m.status,
    }));
  }

  /**
   * Find user by ID
   * SECURITY: Only SUPER_ADMIN or self can view user details
   */
  async findOne(
    userId: string,
    requestingUserId: string,
  ): Promise<User> {
    // Check permission
    if (userId !== requestingUserId) {
      const requester = await this.prisma.user.findUnique({
        where: { id: requestingUserId },
      });

      if (!requester || !requester.isSuperAdmin) {
        throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
      }
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }

  /**
   * Find user by phone
   * Used internally for building membership checks
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
    });
  }

  /**
   * Update user profile
   * SECURITY: Only SUPER_ADMIN or self can update
   */
  async update(
    userId: string,
    updateDto: UpdateUserDto,
    requestingUserId: string,
  ): Promise<User> {
    // Check permission
    if (userId !== requestingUserId) {
      const requester = await this.prisma.user.findUnique({
        where: { id: requestingUserId },
      });

      if (!requester || !requester.isSuperAdmin) {
        throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
      }
    }

    // Check user exists
    const user = await this.findOne(userId, requestingUserId);

    // Prevent updating deleted users
    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException(
        'کاربر حذف شده است و قابل ویرایش نیست',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateDto,
    });
  }

  /**
   * Update user status
   * SECURITY: Only SUPER_ADMIN can change status
   * Implements state machine: ACTIVE ↔ DEACTIVATED
   */
  async updateStatus(
    userId: string,
    statusDto: UpdateUserStatusDto,
    requestingUserId: string,
  ): Promise<User> {
    // Verify permission
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || !requester.isSuperAdmin) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    const user = await this.findOne(userId, requestingUserId);

    // Validate state transitions
    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('کاربر حذف شده است');
    }

    if (
      user.status === UserStatus.DEACTIVATED &&
      statusDto.status === UserStatus.ACTIVE
    ) {
      // Allow reactivation
    } else if (
      user.status === UserStatus.ACTIVE &&
      statusDto.status === UserStatus.DEACTIVATED
    ) {
      // Allow deactivation
    } else if (user.status === statusDto.status) {
      throw new BadRequestException('وضعیت جدید با فعلی یکسان است');
    } else {
      throw new BadRequestException('انتقال وضعیت معتبر نیست');
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: statusDto.status,
        updatedAt: new Date(),
      },
    });

    // If deactivating, also deactivate all memberships
    if (statusDto.status === UserStatus.DEACTIVATED) {
      await this.prisma.buildingMember.updateMany({
        where: { userId, status: 'ACTIVE' },
        data: { status: 'DEACTIVATED' },
      });
    }

    return updatedUser;
  }

  /**
   * Soft delete a user
   * SECURITY: Only SUPER_ADMIN can delete users
   */
  async remove(userId: string, requestingUserId: string): Promise<void> {
    // Verify permission
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || !requester.isSuperAdmin) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    const user = await this.findOne(userId, requestingUserId);

    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('کاربر قبلاً حذف شده است');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });
  }

  /**
   * Helper: Check if user can manage another user
   * Based on role hierarchy: SUPER_ADMIN > MANAGER > BOARD_MEMBER > OWNER > TENANT
   */
  canManageUser(managerRole: UserRole, targetUserRole: UserRole): boolean {
    return hasRolePermission(managerRole, targetUserRole);
  }
}
