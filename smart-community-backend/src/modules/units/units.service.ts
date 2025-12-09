import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(buildingId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.unit.findMany({
        where: { buildingId },
        skip,
        take: limit,
        orderBy: [{ floor: 'asc' }, { number: 'asc' }],
      }),
      this.prisma.unit.count({ where: { buildingId } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(buildingId: string, unitId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id: unitId, buildingId },
    });

    if (!unit) throw new NotFoundException('واحد یافت نشد');
    return unit;
  }

  async getStatistics(buildingId: string) {
    const total = await this.prisma.unit.count({ where: { buildingId } });
    return { total, occupied: 0, vacant: total };
  }
}
