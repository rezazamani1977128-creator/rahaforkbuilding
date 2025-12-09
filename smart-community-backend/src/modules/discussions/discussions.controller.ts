import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import type { User } from '@prisma/client';

@ApiTags('Discussions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('discussions')
export class DiscussionsController {
  constructor(private service: DiscussionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create discussion' })
  async create(
    @Body() createDto: any,
    @CurrentBuilding() buildingId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.create(buildingId, createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discussions' })
  async findAll(
    @CurrentBuilding() buildingId: string,
    @Query('page') page = 1,
  ) {
    return this.service.findAll(buildingId, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discussion details' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) discussionId: string,
    @CurrentBuilding() buildingId: string,
  ) {
    return this.service.findOne(buildingId, discussionId);
  }
}