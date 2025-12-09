import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MESSAGES } from '../constants/messages.constants';

@Injectable()
export class BuildingGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const buildingId = request.headers['x-building-id'] || request.params.buildingId || request.body?.buildingId;

    if (!buildingId) {
      throw new BadRequestException('شناسه ساختمان الزامی است');
    }

    if (!user) {
      throw new ForbiddenException(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Super admins can access any building
    if (user.isSuperAdmin) {
      request.buildingId = buildingId;
      return true;
    }

    // Check if user is a member of this building
    const membership = await this.prisma.buildingMember.findUnique({
      where: {
        userId_buildingId: {
          userId: user.id,
          buildingId,
        },
      },
      include: {
        building: true,
        unit: true,
      },
    });

    if (!membership || !membership.isActive) {
      throw new ForbiddenException(MESSAGES.BUILDING.NOT_MEMBER);
    }

    // Attach building info to request
    request.buildingId = buildingId;
    request.buildingMembership = membership;
    request.user.role = membership.role;
    request.user.unitId = membership.unitId;

    return true;
  }
}
