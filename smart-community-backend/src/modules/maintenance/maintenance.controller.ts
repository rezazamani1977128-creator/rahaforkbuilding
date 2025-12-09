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
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import type { User } from '@prisma/client';
import { MaintenanceCategory, Priority, RequestStatus } from '@prisma/client';
import { UserRole } from '../../common/constants/roles.constants';

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private service: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create maintenance request' })
  async create(
    @Body() createDto: any,
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.create(buildingId, createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance requests' })
  async findAll(
    @CurrentBuilding() buildingId: string,
    @Query('page') page = 1,
    @Query('status') status?: RequestStatus,
    @Query('priority') priority?: Priority,
    @Query('category') category?: MaintenanceCategory,
  ) {
    return this.service.findAll(buildingId, page, 20, { status, priority, category });
  }

  @Get('statistics')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get maintenance statistics' })
  async getStatistics(@CurrentBuilding() buildingId: string) {
    return this.service.getStatistics(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get maintenance request details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.findOne(buildingId, requestId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update maintenance request' })
  async update(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @Body() updateDto: any,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.update(buildingId, requestId, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Update maintenance request status' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @Body() body: { status: RequestStatus },
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.updateStatus(buildingId, requestId, body.status);
  }

  @Patch(':id/assign')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign maintenance request' })
  async assign(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @Body() body: { assignedToId: string },
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.assignRequest(buildingId, requestId, body.assignedToId);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to maintenance request' })
  async addNote(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @Body() body: { content: string; isInternal?: boolean },
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.addNote(buildingId, requestId, user.id, body.content, body.isInternal);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Add image to maintenance request' })
  async addImage(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @Body() body: { url: string; caption?: string },
  ) {
    return this.service.addImage(requestId, body.url, body.caption);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete maintenance request' })
  async remove(
    @Param('id', new ParseUUIDPipe()) requestId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.remove(buildingId, requestId);
  }
}
