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
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserQueryDto,
  UserResponseDto,
  UserWithBuildingsResponseDto,
} from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'ایجاد کاربر جدید' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(
    @Body() createDto: CreateUserDto,
    @CurrentUser() user: User,
  ) {
    const newUser = await this.usersService.create(createDto, user.id);
    return {
      success: true,
      message: MESSAGES.USER.CREATED,
      data: newUser,
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'دریافت لیست کاربران' })
  async findAll(@Query() query: UserQueryDto, @CurrentUser() user: User) {
    const result = await this.usersService.findAll(query, user.id);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'دریافت پروفایل کاربر جاری' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async getProfile(@CurrentUser() user: User) {
    const profile = await this.usersService.getProfile(user.id);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: profile,
    };
  }

  @Get('me/buildings')
  @ApiOperation({ summary: 'دریافت ساختمانهای کاربر جاری' })
  async getUserBuildings(@CurrentUser() user: User) {
    const buildings = await this.usersService.getUserBuildings(user.id);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: buildings,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات کاربر' })
  @ApiParam({ name: 'id', description: 'شناسه کاربر' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const userData = await this.usersService.findOne(id, user.id);
    return {
      success: true,
      message: MESSAGES.GENERAL.SUCCESS,
      data: userData,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش پروفایل کاربر' })
  @ApiParam({ name: 'id', description: 'شناسه کاربر' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.usersService.update(id, updateDto, user.id);
    return {
      success: true,
      message: MESSAGES.USER.UPDATED,
      data: updatedUser,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'تغییر وضعیت کاربر' })
  @ApiParam({ name: 'id', description: 'شناسه کاربر' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: UpdateUserStatusDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.usersService.updateStatus(
      id,
      statusDto,
      user.id,
    );
    return {
      success: true,
      message: MESSAGES.USER.STATUS_UPDATED,
      data: updatedUser,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'حذف کاربر' })
  @ApiParam({ name: 'id', description: 'شناسه کاربر' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.usersService.remove(id, user.id);
    return {
      success: true,
      message: MESSAGES.USER.DELETED,
    };
  }
}
