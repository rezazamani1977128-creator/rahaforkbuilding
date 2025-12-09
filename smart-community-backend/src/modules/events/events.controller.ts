import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import type { User } from '@prisma/client';
import { UserRole } from '../../common/constants/roles.constants';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create event' })
  async create(
    @Body() createDto: any,
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.create(buildingId, createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(@CurrentBuilding() buildingId: string, @Query('page') page = 1) {
    return this.service.findAll(buildingId, page, 20);
  }

  @Get('statistics')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get events statistics' })
  async getStatistics(@CurrentBuilding() buildingId: string) {
    return this.service.getStatistics(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.findOne(buildingId, eventId);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Update event' })
  async update(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Body() updateDto: any,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.update(buildingId, eventId, updateDto);
  }

  @Post(':id/rsvp')
  @ApiOperation({ summary: 'RSVP to event' })
  async rsvp(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @Body() body: { status: string },
    @CurrentUser() user: User,
  ) {
    return this.service.rsvp(eventId, user.id, body.status);
  }

  @Delete(':id/rsvp')
  @ApiOperation({ summary: 'Cancel RSVP' })
  async removeRsvp(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.removeRsvp(eventId, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete event' })
  async remove(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.remove(buildingId, eventId);
  }
}
