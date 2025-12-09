import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { BuildingsService } from './buildings.service';
import {
  CreateBuildingDto,
  UpdateBuildingDto,
  CreateUnitDto,
  UpdateUnitDto,
  AddMemberDto,
  BuildingQueryDto,
  UnitQueryDto,
  MemberQueryDto,
  BuildingResponseDto,
  UnitResponseDto,
  BuildingMemberResponseDto,
} from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Buildings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  // ========================
  // Buildings
  // ========================

  @Post()
  @ApiOperation({ summary: 'ایجاد ساختمان جدید' })
  @ApiResponse({ status: 201, type: BuildingResponseDto })
  async create(
    @Body() createDto: CreateBuildingDto,
    @CurrentUser() user: User,
  ) {
    const building = await this.buildingsService.createBuilding(
      createDto,
      user.id,
    );
    return {
      success: true,
      message: MESSAGES.BUILDING.CREATED,
      data: building,
    };
  }

  @Get()
  @ApiOperation({ summary: 'دریافت لیست ساختمانهای کاربر' })
  async findAll(@Query() query: BuildingQueryDto, @CurrentUser() user: User) {
    const result = await this.buildingsService.findAllBuildings(
      user.id,
      query,
    );
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'آمار ساختمانهای کاربر' })
  async getStats(@CurrentUser() user: User) {
    const query = new BuildingQueryDto();
    query.page = 1;
    query.limit = 1000;
    const buildings = await this.buildingsService.findAllBuildings(user.id, query);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: {
        totalBuildings: buildings.meta.total,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات ساختمان' })
  @ApiParam({ name: 'id', description: 'شناسه ساختمان' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const building = await this.buildingsService.findOne(id, user.id);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: building,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'ویرایش ساختمان' })
  @ApiParam({ name: 'id', description: 'شناسه ساختمان' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBuildingDto,
    @CurrentUser() user: User,
  ) {
    const building = await this.buildingsService.updateBuilding(
      id,
      updateDto,
      user.id,
    );
    return {
      success: true,
      message: MESSAGES.BUILDING.UPDATED,
      data: building,
    };
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'حذف ساختمان' })
  @ApiParam({ name: 'id', description: 'شناسه ساختمان' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.buildingsService.deleteBuilding(id, user.id);
    return {
      success: true,
      message: MESSAGES.BUILDING.DELETED,
    };
  }

  // ========================
  // Units
  // ========================

  @Post(':buildingId/units')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'ایجاد واحد جدید' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  async createUnit(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Body() createDto: CreateUnitDto,
    @CurrentUser() user: User,
  ) {
    const unit = await this.buildingsService.createUnit(
      buildingId,
      createDto,
      user.id,
    );
    return {
      success: true,
      message: 'واحد با موفقیت ایجاد شد',
      data: unit,
    };
  }

  @Get(':buildingId/units')
  @ApiOperation({ summary: 'دریافت لیست واحدها' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  async findAllUnits(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Query() query: UnitQueryDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.buildingsService.findAllUnits(
      buildingId,
      user.id,
      query,
    );
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':buildingId/units/:unitId')
  @ApiOperation({ summary: 'دریافت جزئیات واحد' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  @ApiParam({ name: 'unitId', description: 'شناسه واحد' })
  async findOneUnit(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @CurrentUser() user: User,
  ) {
    const unit = await this.buildingsService.findOneUnit(
      buildingId,
      unitId,
      user.id,
    );
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: unit,
    };
  }

  @Patch(':buildingId/units/:unitId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'ویرایش واحد' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  @ApiParam({ name: 'unitId', description: 'شناسه واحد' })
  async updateUnit(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Body() updateDto: UpdateUnitDto,
    @CurrentUser() user: User,
  ) {
    const unit = await this.buildingsService.updateUnit(
      buildingId,
      unitId,
      updateDto,
      user.id,
    );
    return {
      success: true,
      message: 'واحد با موفقیت ویرایش شد',
      data: unit,
    };
  }

  @Delete(':buildingId/units/:unitId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'حذف واحد' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  @ApiParam({ name: 'unitId', description: 'شناسه واحد' })
  async deleteUnit(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @CurrentUser() user: User,
  ) {
    await this.buildingsService.deleteUnit(buildingId, unitId, user.id);
    return {
      success: true,
      message: 'واحد با موفقیت حذف شد',
    };
  }

  // ========================
  // Members
  // ========================

  @Post(':buildingId/members')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'افزودن عضو جدید' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  async addMember(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Body() addMemberDto: AddMemberDto,
    @CurrentUser() user: User,
  ) {
    const member = await this.buildingsService.addMember(
      buildingId,
      addMemberDto,
      user.id,
    );
    return {
      success: true,
      message: 'عضو با موفقیت اضافه شد',
      data: member,
    };
  }

  @Get(':buildingId/members')
  @ApiOperation({ summary: 'دریافت لیست اعضا' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  async findAllMembers(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Query() query: MemberQueryDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.buildingsService.findAllMembers(
      buildingId,
      user.id,
      query,
    );
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: result.data,
      meta: result.meta,
    };
  }

  @Delete(':buildingId/members/:memberId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'حذف عضو' })
  @ApiParam({ name: 'buildingId', description: 'شناسه ساختمان' })
  @ApiParam({ name: 'memberId', description: 'شناسه عضویت' })
  async removeMember(
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @CurrentUser() user: User,
  ) {
    await this.buildingsService.removeMember(buildingId, memberId, user.id);
    return {
      success: true,
      message: 'عضو با موفقیت حذف شد',
    };
  }
}
