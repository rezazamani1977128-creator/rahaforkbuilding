import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResidentQueryDto, ResidentResponseDto } from './dto/resident-query.dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async findAllByBuilding(
    buildingId: string,
    query: ResidentQueryDto,
  ) {
    const { page = 1, limit = 20, search, unitNumber, floor } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BuildingMemberWhereInput = {
      buildingId,
      status: 'ACTIVE',
    };

    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (unitNumber || floor) {
      where.unit = {};
      if (unitNumber) {
        (where.unit as any).number = { contains: unitNumber, mode: 'insensitive' };
      }
      if (floor) {
        (where.unit as any).floor = parseInt(floor);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.buildingMember.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true,
              email: true,
              nationalId: true,
              createdAt: true,
            },
          },
          unit: {
            select: { id: true, number: true, floor: true },
          },
        },
        orderBy: [{ unit: { floor: 'asc' } }, { unit: { number: 'asc' } }],
      }),
      this.prisma.buildingMember.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const residents: ResidentResponseDto[] = data.map((member) => ({
      id: member.user.id,
      phone: member.user.phone,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email || undefined,
      nationalId: member.user.nationalId || undefined,
      unit: member.unit
        ? {
            id: member.unit.id,
            number: member.unit.number,
            floor: member.unit.floor,
          }
        : undefined,
      role: member.role,
      createdAt: member.user.createdAt,
    }));

    return {
      data: residents,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(buildingId: string, userId: string): Promise<ResidentResponseDto> {
    const member = await this.prisma.buildingMember.findFirst({
      where: { buildingId, userId, status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            email: true,
            nationalId: true,
            createdAt: true,
          },
        },
        unit: {
          select: { id: true, number: true, floor: true },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(MESSAGES.USER?.NOT_FOUND || 'ساکن یافت نشد');
    }

    return {
      id: member.user.id,
      phone: member.user.phone,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      email: member.user.email || undefined,
      nationalId: member.user.nationalId || undefined,
      unit: member.unit
        ? {
            id: member.unit.id,
            number: member.unit.number,
            floor: member.unit.floor,
          }
        : undefined,
      role: member.role,
      createdAt: member.user.createdAt,
    };
  }

  async getStatistics(buildingId: string) {
    const [totalResidents, activeResidents, byUnit] = await Promise.all([
      this.prisma.buildingMember.count({
        where: { buildingId },
      }),
      this.prisma.buildingMember.count({
        where: { buildingId, status: 'ACTIVE' },
      }),
      this.prisma.buildingMember.groupBy({
        by: ['unitId'],
        where: { buildingId, status: 'ACTIVE' },
        _count: true,
      }),
    ]);

    return {
      totalResidents,
      activeResidents,
      occupiedUnits: byUnit.length,
    };
  }
}
