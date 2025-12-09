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
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import type { User } from '@prisma/client';
import { AnnouncementPriority } from '@prisma/client';
import { UserRole } from '../../common/constants/roles.constants';

@ApiTags('Announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private service: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create announcement' })
  async create(
    @Body() createDto: any,
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.create(buildingId, createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  async findAll(
    @CurrentBuilding() buildingId: string,
    @Query('page') page = 1,
    @Query('priority') priority?: AnnouncementPriority,
    @Query('pinned') pinned?: boolean,
  ) {
    return this.service.findAll(buildingId, page, 20, {
      priority,
      isPinned: pinned,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) announcementId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.findOne(buildingId, announcementId);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Update announcement' })
  async update(
    @Param('id', new ParseUUIDPipe()) announcementId: string,
    @Body() updateDto: any,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.update(buildingId, announcementId, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete announcement' })
  async remove(
    @Param('id', new ParseUUIDPipe()) announcementId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.remove(buildingId, announcementId);
  }

  @Post(':id/mark-read')
  @ApiOperation({ summary: 'Mark announcement as read' })
  async markAsRead(
    @Param('id', new ParseUUIDPipe()) announcementId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.markAsRead(announcementId, user.id);
  }

  @Get(':id/stats')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get announcement read statistics' })
  async getStats(
    @Param('id', new ParseUUIDPipe()) announcementId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.getReadStats(announcementId, buildingId);
  }
}
