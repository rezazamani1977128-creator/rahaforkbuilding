import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(
    buildingId: string,
    createDto: {
      title: string;
      description?: string;
      type: string;
      date: Date;
      startTime: string;
      endTime?: string;
      location: string;
      maxAttendees?: number;
    },
    createdById: string,
  ) {
    return this.prisma.event.create({
      data: {
        buildingId,
        createdById,
        title: createDto.title,
        description: createDto.description,
        type: createDto.type,
        date: createDto.date,
        startTime: createDto.startTime,
        endTime: createDto.endTime,
        location: createDto.location,
        maxAttendees: createDto.maxAttendees,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        rsvps: { select: { id: true, userId: true, status: true } },
      },
    });
  }

  async findAll(buildingId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { buildingId },
        skip,
        take: limit,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          rsvps: { select: { id: true, userId: true, status: true } },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.event.count({ where: { buildingId } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(buildingId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, buildingId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        rsvps: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!event) throw new NotFoundException('رویداد یافت نشد');
    return event;
  }

  async update(
    buildingId: string,
    eventId: string,
    updateDto: {
      title?: string;
      description?: string;
      type?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
      location?: string;
      maxAttendees?: number;
    },
  ) {
    return this.prisma.event.update({
      where: { id: eventId },
      data: updateDto,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        rsvps: { select: { id: true, userId: true, status: true } },
      },
    });
  }

  async rsvp(eventId: string, userId: string, status: string) {
    return this.prisma.eventRsvp.upsert({
      where: { eventId_userId: { eventId, userId } },
      create: { eventId, userId, status },
      update: { status },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async removeRsvp(eventId: string, userId: string) {
    return this.prisma.eventRsvp.delete({
      where: { eventId_userId: { eventId, userId } },
    });
  }

  async remove(buildingId: string, eventId: string) {
    return this.prisma.event.delete({
      where: { id: eventId },
    });
  }

  async getStatistics(buildingId: string) {
    const [total, upcoming, past] = await Promise.all([
      this.prisma.event.count({ where: { buildingId } }),
      this.prisma.event.count({
        where: { buildingId, date: { gte: new Date() } },
      }),
      this.prisma.event.count({
        where: { buildingId, date: { lt: new Date() } },
      }),
    ]);

    return { total, upcoming, past };
  }
}
