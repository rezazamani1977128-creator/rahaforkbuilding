import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  async create(buildingId: string, data: any, createdById: string) {
    return this.prisma.discussion.create({
      data: { buildingId, ...data, authorId: createdById },
    });
  }

  async findAll(buildingId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.discussion.findMany({
        where: { buildingId },
        skip,
        take: limit,
        include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
      }),
      this.prisma.discussion.count({ where: { buildingId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(buildingId: string, discussionId: string) {
    const discussion = await this.prisma.discussion.findFirst({
      where: { id: discussionId, buildingId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        replies: { include: { author: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
    if (!discussion) throw new NotFoundException('بحث یافت نشد');
    return discussion;
  }
}