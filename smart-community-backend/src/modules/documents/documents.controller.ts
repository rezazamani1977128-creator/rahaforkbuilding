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
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import type { User } from '@prisma/client';
import { DocumentCategory } from '@prisma/client';
import { UserRole } from '../../common/constants/roles.constants';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Upload document' })
  async create(
    @Body() createDto: any,
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.create(buildingId, createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  async findAll(
    @CurrentBuilding() buildingId: string,
    @Query('page') page = 1,
    @Query('category') category?: DocumentCategory,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(buildingId, page, 20, { category, search });
  }

  @Get('statistics')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Get documents statistics' })
  async getStatistics(@CurrentBuilding() buildingId: string) {
    return this.service.getStatistics(buildingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) documentId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.findOne(buildingId, documentId);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Update document' })
  async update(
    @Param('id', new ParseUUIDPipe()) documentId: string,
    @Body() updateDto: any,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.update(buildingId, documentId, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete document' })
  async remove(
    @Param('id', new ParseUUIDPipe()) documentId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.remove(buildingId, documentId);
  }
}
