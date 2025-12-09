import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentCategory, DocumentAccessLevel } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    buildingId: string,
    createDto: {
      name: string;
      description?: string;
      category: DocumentCategory;
      fileUrl: string;
      fileType: string;
      fileSize: number;
      accessLevel?: DocumentAccessLevel;
      expiresAt?: Date;
    },
    uploadedById: string,
  ) {
    return this.prisma.document.create({
      data: {
        buildingId,
        uploadedById,
        name: createDto.name,
        description: createDto.description,
        category: createDto.category,
        fileUrl: createDto.fileUrl,
        fileType: createDto.fileType,
        fileSize: createDto.fileSize,
        accessLevel: createDto.accessLevel || DocumentAccessLevel.ALL,
        expiresAt: createDto.expiresAt,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findAll(
    buildingId: string,
    page = 1,
    limit = 20,
    filters?: { category?: DocumentCategory; search?: string },
  ) {
    const skip = (page - 1) * limit;
    const where: any = { buildingId };
    if (filters?.category) where.category = filters.category;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(buildingId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, buildingId },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!document) throw new NotFoundException('سند یافت نشد');
    return document;
  }

  async update(
    buildingId: string,
    documentId: string,
    updateDto: {
      name?: string;
      description?: string;
      category?: DocumentCategory;
      accessLevel?: DocumentAccessLevel;
      expiresAt?: Date;
    },
  ) {
    return this.prisma.document.update({
      where: { id: documentId },
      data: updateDto,
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async remove(buildingId: string, documentId: string) {
    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }

  async getStatistics(buildingId: string) {
    const [total, byCategory, recent] = await Promise.all([
      this.prisma.document.count({ where: { buildingId } }),
      this.prisma.document.groupBy({
        by: ['category'],
        where: { buildingId },
        _count: true,
      }),
      this.prisma.document.count({
        where: {
          buildingId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
      recentUploadedThisWeek: recent,
    };
  }
}
