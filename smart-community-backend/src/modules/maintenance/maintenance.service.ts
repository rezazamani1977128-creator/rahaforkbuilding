import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaintenanceCategory, Priority, RequestStatus } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(
    buildingId: string,
    createDto: {
      title: string;
      description: string;
      category: MaintenanceCategory;
      priority?: Priority;
      unitNumber?: string;
      location?: string;
    },
    reportedById: string,
  ) {
    return this.prisma.maintenanceRequest.create({
      data: {
        buildingId,
        reportedById,
        title: createDto.title,
        description: createDto.description,
        category: createDto.category,
        priority: createDto.priority || Priority.MEDIUM,
        status: RequestStatus.NEW,
        unitNumber: createDto.unitNumber,
        location: createDto.location,
      },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        notes: { include: { createdBy: { select: { id: true, firstName: true, lastName: true } } } },
        images: true,
      },
    });
  }

  async findAll(
    buildingId: string,
    page = 1,
    limit = 20,
    filters?: { status?: RequestStatus; priority?: Priority; category?: MaintenanceCategory },
  ) {
    const skip = (page - 1) * limit;
    const where: any = { buildingId };
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.category) where.category = filters.category;

    const [data, total] = await Promise.all([
      this.prisma.maintenanceRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          reportedBy: { select: { id: true, firstName: true, lastName: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          notes: { select: { id: true } },
          images: { select: { id: true } },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.maintenanceRequest.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(buildingId: string, requestId: string) {
    const request = await this.prisma.maintenanceRequest.findFirst({
      where: { id: requestId, buildingId },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        notes: { include: { createdBy: { select: { id: true, firstName: true, lastName: true } } } },
        images: true,
      },
    });

    if (!request) throw new NotFoundException('درخواست تعمیر یافت نشد');
    return request;
  }

  async update(
    buildingId: string,
    requestId: string,
    updateDto: {
      title?: string;
      description?: string;
      category?: MaintenanceCategory;
      priority?: Priority;
      unitNumber?: string;
      location?: string;
    },
  ) {
    return this.prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: updateDto,
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        notes: { select: { id: true } },
        images: { select: { id: true } },
      },
    });
  }

  async updateStatus(buildingId: string, requestId: string, status: RequestStatus) {
    const completedAt = status === RequestStatus.COMPLETED ? new Date() : null;

    return this.prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { status, completedAt },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async assignRequest(buildingId: string, requestId: string, assignedToId: string) {
    return this.prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { assignedToId },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async addNote(
    buildingId: string,
    requestId: string,
    createdById: string,
    content: string,
    isInternal = false,
  ) {
    return this.prisma.maintenanceNote.create({
      data: {
        requestId,
        createdById,
        content,
        isInternal,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async addImage(requestId: string, url: string, caption?: string) {
    return this.prisma.maintenanceImage.create({
      data: { requestId, url, caption },
    });
  }

  async remove(buildingId: string, requestId: string) {
    return this.prisma.maintenanceRequest.delete({
      where: { id: requestId },
    });
  }

  async getStatistics(buildingId: string) {
    const [byStatus, byPriority, byCategory] = await Promise.all([
      this.prisma.maintenanceRequest.groupBy({
        by: ['status'],
        where: { buildingId },
        _count: true,
      }),
      this.prisma.maintenanceRequest.groupBy({
        by: ['priority'],
        where: { buildingId },
        _count: true,
      }),
      this.prisma.maintenanceRequest.groupBy({
        by: ['category'],
        where: { buildingId },
        _count: true,
      }),
    ]);

    return {
      byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
      byPriority: Object.fromEntries(byPriority.map((p) => [p.priority, p._count])),
      byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
    };
  }
}
