import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnouncementPriority } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(
    buildingId: string,
    createDto: {
      title: string;
      content: string;
      priority?: AnnouncementPriority;
      isPinned?: boolean;
      publishAt?: Date;
      expiresAt?: Date;
    },
    createdById: string,
  ) {
    return this.prisma.announcement.create({
      data: {
        buildingId,
        createdById,
        title: createDto.title,
        content: createDto.content,
        priority: createDto.priority || AnnouncementPriority.MEDIUM,
        isPinned: createDto.isPinned || false,
        publishAt: createDto.publishAt,
        expiresAt: createDto.expiresAt,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        readReceipts: true,
      },
    });
  }

  async findAll(
    buildingId: string,
    page = 1,
    limit = 20,
    filters?: { priority?: AnnouncementPriority; isPinned?: boolean },
  ) {
    const skip = (page - 1) * limit;
    const where: any = { buildingId };
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.isPinned !== undefined) where.isPinned = filters.isPinned;

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          readReceipts: { select: { userId: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(buildingId: string, announcementId: string) {
    const announcement = await this.prisma.announcement.findFirst({
      where: { id: announcementId, buildingId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        readReceipts: { select: { userId: true, readAt: true } },
      },
    });

    if (!announcement) throw new NotFoundException('اطلاعیه یافت نشد');
    return announcement;
  }

  async update(
    buildingId: string,
    announcementId: string,
    updateDto: {
      title?: string;
      content?: string;
      priority?: AnnouncementPriority;
      isPinned?: boolean;
      expiresAt?: Date;
    },
  ) {
    return this.prisma.announcement.update({
      where: { id: announcementId },
      data: updateDto,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        readReceipts: { select: { userId: true } },
      },
    });
  }

  async remove(buildingId: string, announcementId: string) {
    return this.prisma.announcement.delete({
      where: { id: announcementId },
    });
  }

  async markAsRead(announcementId: string, userId: string) {
    return this.prisma.announcementRead.upsert({
      where: { announcementId_userId: { announcementId, userId } },
      update: { readAt: new Date() },
      create: { announcementId, userId },
    });
  }

  async getReadStats(announcementId: string, buildingId: string) {
    const [readCount, building] = await Promise.all([
      this.prisma.announcementRead.count({ where: { announcementId } }),
      this.prisma.building.findUnique({
        where: { id: buildingId },
        select: { members: { where: { status: 'ACTIVE' } } },
      }),
    ]);

    const totalResidents = building?.members?.length || 0;
    return {
      readCount,
      totalResidents,
      percentage: totalResidents > 0 ? Math.round((readCount / totalResidents) * 100) : 0,
    };
  }
}
