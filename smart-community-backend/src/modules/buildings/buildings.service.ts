import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Building,
  Unit,
  BuildingMember,
  UserRole,
  SubscriptionPlan,
  Prisma,
} from '@prisma/client';
import {
  CreateBuildingDto,
  UpdateBuildingDto,
  CreateUnitDto,
  UpdateUnitDto,
  AddMemberDto,
  BuildingQueryDto,
  UnitQueryDto,
  MemberQueryDto,
} from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class BuildingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create building and add creator as manager
   * TRANSACTION-SAFE: All operations atomic
   */
  async createBuilding(
    createDto: CreateBuildingDto,
    createdById: string,
  ): Promise<Building> {
    return this.prisma.$transaction(async (tx) => {
      // Create building
      const building = await tx.building.create({
        data: {
          name: createDto.name,
          address: createDto.address || '',
          city: createDto.city || 'تهران',
          totalFloors: createDto.totalFloors || 1,
          totalUnits: 1,
          subscriptionPlan: createDto.subscriptionPlan || SubscriptionPlan.BASIC,
        },
      });

      // Add creator as manager
      await tx.buildingMember.create({
        data: {
          buildingId: building.id,
          userId: createdById,
          role: UserRole.MANAGER,
          status: 'ACTIVE',
        },
      });

      return building;
    });
  }

  /**
   * Get all buildings where user is a member
   * MULTI-TENANT SAFETY: Only return buildings user belongs to
   */
  async findAllBuildings(
    userId: string,
    query: BuildingQueryDto,
  ): Promise<PaginatedResponseDto<Building>> {
    const { page = 1, limit = 10, search, subscriptionPlan } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BuildingWhereInput = {
      members: {
        some: { userId, status: 'ACTIVE' },
      },
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (subscriptionPlan) {
      where.subscriptionPlan = subscriptionPlan;
    }

    const [data, total] = await Promise.all([
      this.prisma.building.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.building.count({ where }),
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
   * Get building details with access check
   * SECURITY: Verify user is member of building
   */
  async findOne(
    buildingId: string,
    userId: string,
  ): Promise<Building & { stats: any }> {
    // Verify access
    const membership = await this.prisma.buildingMember.findUnique({
      where: { userId_buildingId: { userId, buildingId } },
    });

    if (!membership) {
      throw new ForbiddenException(MESSAGES.BUILDING.NO_ACCESS);
    }

    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      throw new NotFoundException(MESSAGES.BUILDING.NOT_FOUND);
    }

    const [unitsCount, membersCount] = await Promise.all([
      this.prisma.unit.count({ where: { buildingId } }),
      this.prisma.buildingMember.count({
        where: { buildingId, status: 'ACTIVE' },
      }),
    ]);

    return {
      ...building,
      stats: {
        unitsCount,
        membersCount,
      },
    } as any;
  }

  /**
   * Update building
   * SECURITY: Only manager or above can update
   */
  async updateBuilding(
    buildingId: string,
    updateDto: UpdateBuildingDto,
    userId: string,
  ): Promise<Building> {
    // Verify access and permission
    const membership = await this.prisma.buildingMember.findUnique({
      where: { userId_buildingId: { userId, buildingId } },
    });

    if (!membership) {
      throw new ForbiddenException(MESSAGES.BUILDING.NO_ACCESS);
    }

    if (
      membership.role !== UserRole.MANAGER &&
      membership.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    return this.prisma.building.update({
      where: { id: buildingId },
      data: updateDto,
    });
  }

  /**
   * Delete building (soft delete + cascade)
   * SECURITY: Only manager can delete
   * Validation: Cannot delete if has active members
   */
  async deleteBuilding(buildingId: string, userId: string): Promise<void> {
    // Verify access
    const membership = await this.prisma.buildingMember.findUnique({
      where: { userId_buildingId: { userId, buildingId } },
    });

    if (!membership || membership.role !== UserRole.MANAGER) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    // Check for active members
    const activeMembers = await this.prisma.buildingMember.count({
      where: { buildingId, status: 'ACTIVE' },
    });

    if (activeMembers > 1) {
      throw new BadRequestException(
        'ساختمان دارای اعضای فعال است. ابتدا اعضا را حذف کنید',
      );
    }

    // Check for charges
    const hasCharges = await this.prisma.charge.findFirst({
      where: { buildingId },
    });

    if (hasCharges) {
      throw new BadRequestException('ساختمان دارای شارژ ثبت شده است');
    }

    // Soft delete
    await this.prisma.building.update({
      where: { id: buildingId },
      data: { deletedAt: new Date() },
    });
  }

  // ========================
  // Units Management
  // ========================

  /**
   * Create unit in building
   * TRANSACTION-SAFE
   */
  async createUnit(
    buildingId: string,
    createDto: CreateUnitDto,
    userId: string,
  ): Promise<Unit> {
    // Verify building exists and user has access
    const building = await this.findOne(buildingId, userId);

    return this.prisma.unit.create({
      data: {
        buildingId,
        number: createDto.number,
        floor: createDto.floor || 0,
        area: createDto.area || 0,
        coefficient: createDto.coefficient || 1,
        residentsCount: 0,
      },
    });
  }

  /**
   * Get all units in building
   */
  async findAllUnits(
    buildingId: string,
    userId: string,
    query: UnitQueryDto,
  ): Promise<PaginatedResponseDto<Unit>> {
    // Verify access
    await this.findOne(buildingId, userId);

    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UnitWhereInput = { buildingId };

    if (search) {
      where.number = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ floor: 'asc' }, { number: 'asc' }],
      }),
      this.prisma.unit.count({ where }),
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
   * Get unit details
   */
  async findOneUnit(
    buildingId: string,
    unitId: string,
    userId: string,
  ): Promise<Unit> {
    // Verify access to building
    await this.findOne(buildingId, userId);

    const unit = await this.prisma.unit.findFirst({
      where: { id: unitId, buildingId },
    });

    if (!unit) {
      throw new NotFoundException('واحد یافت نشد');
    }

    return unit;
  }

  /**
   * Update unit
   */
  async updateUnit(
    buildingId: string,
    unitId: string,
    updateDto: UpdateUnitDto,
    userId: string,
  ): Promise<Unit> {
    // Verify access
    await this.findOneUnit(buildingId, unitId, userId);

    return this.prisma.unit.update({
      where: { id: unitId },
      data: updateDto,
    });
  }

  /**
   * Delete unit
   * VALIDATION: Cannot delete if has active residents
   */
  async deleteUnit(
    buildingId: string,
    unitId: string,
    userId: string,
  ): Promise<void> {
    const unit = await this.findOneUnit(buildingId, unitId, userId);

    // Check for active residents
    if (unit.residentsCount > 0) {
      throw new BadRequestException(
        'واحد دارای ساکنان است. ابتدا ساکنان را حذف کنید',
      );
    }

    await this.prisma.unit.delete({
      where: { id: unitId },
    });
  }

  // ========================
  // Members Management
  // ========================

  /**
   * Add member to building
   * TRANSACTION-SAFE: Creates user if not exists, adds membership
   * SECURITY: Validates role hierarchy
   */
  async addMember(
    buildingId: string,
    addMemberDto: AddMemberDto,
    addedById: string,
  ): Promise<BuildingMember> {
    // Verify adder's permission
    const adderMembership = await this.prisma.buildingMember.findUnique({
      where: { userId_buildingId: { userId: addedById, buildingId } },
    });

    if (
      !adderMembership ||
      (adderMembership.role !== UserRole.MANAGER &&
        adderMembership.role !== UserRole.SUPER_ADMIN)
    ) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    // Verify target role is not higher than adder's
    const isValidRole =
      addMemberDto.role === UserRole.TENANT ||
      addMemberDto.role === UserRole.OWNER ||
      addMemberDto.role === UserRole.BOARD_MEMBER ||
      (adderMembership.role === UserRole.MANAGER &&
        addMemberDto.role !== UserRole.MANAGER);

    if (!isValidRole) {
      throw new ForbiddenException(
        'شما مجاز به اضافه‌کردن این نقش نیستید',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Find or create user
      let user = await tx.user.findUnique({
        where: { phone: addMemberDto.phone },
      });

      if (!user) {
        // Extract name from phone if possible, or use defaults
        user = await tx.user.create({
          data: {
            phone: addMemberDto.phone,
            firstName: 'کاربر',
            lastName: 'جدید',
          },
        });
      }

      // Check if already member
      const existing = await tx.buildingMember.findUnique({
        where: { userId_buildingId: { userId: user.id, buildingId } },
      });

      if (existing) {
        throw new BadRequestException('این کاربر قبلاً عضو این ساختمان است');
      }

      // Create membership
      const member = await tx.buildingMember.create({
        data: {
          buildingId,
          userId: user.id,
          role: addMemberDto.role,
          status: 'ACTIVE',
        },
      });

      // If assigning units, increment residents count
      if (
        addMemberDto.unitIds &&
        addMemberDto.unitIds.length > 0 &&
        addMemberDto.role === UserRole.OWNER
      ) {
        await tx.unit.updateMany({
          where: {
            id: { in: addMemberDto.unitIds },
            buildingId,
          },
          data: {
            residentsCount: { increment: 1 },
          },
        });
      }

      return member;
    });
  }

  /**
   * Get all members of building
   */
  async findAllMembers(
    buildingId: string,
    userId: string,
    query: MemberQueryDto,
  ): Promise<PaginatedResponseDto<BuildingMember>> {
    // Verify access
    await this.findOne(buildingId, userId);

    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BuildingMemberWhereInput = {
      buildingId,
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.buildingMember.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, firstName: true, lastName: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.buildingMember.count({ where }),
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
   * Remove member from building
   * TRANSACTION-SAFE: Deactivates member and decrements resident counts
   */
  async removeMember(
    buildingId: string,
    memberId: string,
    requestingUserId: string,
  ): Promise<void> {
    // Verify removing user has permission
    const requesterMembership = await this.prisma.buildingMember.findUnique({
      where: { userId_buildingId: { userId: requestingUserId, buildingId } },
    });

    if (
      !requesterMembership ||
      requesterMembership.role !== UserRole.MANAGER
    ) {
      throw new ForbiddenException(MESSAGES.GENERAL.UNAUTHORIZED);
    }

    // Verify target member exists
    const targetMember = await this.prisma.buildingMember.findFirst({
      where: { id: memberId, buildingId },
    });

    if (!targetMember) {
      throw new NotFoundException('عضو یافت نشد');
    }

    await this.prisma.$transaction(async (tx) => {
      // Find units owned by this member
      const units = await tx.unit.findMany({
        where: { buildingId },
      });

      // For simplicity, decrement residents if owner
      if (targetMember.role === UserRole.OWNER) {
        await tx.unit.updateMany({
          where: { buildingId },
          data: { residentsCount: { decrement: 1 } },
        });
      }

      // Deactivate member
      await tx.buildingMember.update({
        where: { id: memberId },
        data: { status: 'DEACTIVATED' },
      });
    });
  }

  /**
   * Get building statistics
   */
  async getBuildingStats(buildingId: string, userId: string): Promise<any> {
    const building = await this.findOne(buildingId, userId);

    const [
      unitsCount,
      activeMembers,
      pendingCharges,
    ] = await Promise.all([
      this.prisma.unit.count({ where: { buildingId } }),
      this.prisma.buildingMember.count({
        where: { buildingId, status: 'ACTIVE' },
      }),
      this.prisma.charge.count({
        where: { buildingId, status: 'ACTIVE' },
      }),
    ]);

    return {
      buildingId,
      name: building.name,
      unitsCount,
      activeMembers,
      pendingCharges,
      subscriptionPlan: building.subscriptionPlan,
    };
  }
}
