import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import {
  CreateChargeDto,
  UpdateChargeDto,
  UpdateChargeStatusDto,
  CreateCustomChargeDto,
  ChargeQueryDto,
  UnitChargeQueryDto,
  ChargeResponseDto,
  ChargeWithUnitsResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';

@ApiTags('Charges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Create a new charge' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Charge created successfully',
    type: ChargeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createChargeDto: CreateChargeDto,
  ) {
    const charge = await this.chargesService.create(
      buildingId,
      createChargeDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.CHARGE.CREATED,
      data: charge,
    };
  }

  @Post('custom')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Create a custom charge with per-unit amounts' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Custom charge created successfully',
    type: ChargeResponseDto,
  })
  async createCustomCharge(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateCustomChargeDto,
  ) {
    const charge = await this.chargesService.createCustomCharge(
      buildingId,
      createDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.CHARGE.CREATED,
      data: charge,
    };
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get all charges for the building' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Charges retrieved successfully',
  })
  async findAll(
    @CurrentBuilding('id') buildingId: string,
    @Query() query: ChargeQueryDto,
  ) {
    const result = await this.chargesService.findAll(buildingId, query);
    return {
      success: true,
      message: MESSAGES.CHARGE.FETCHED,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get charge statistics for the building' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
  })
  async getStats(@CurrentBuilding('id') buildingId: string) {
    const stats = await this.chargesService.getChargeStats(buildingId);
    return {
      success: true,
      message: MESSAGES.CHARGE.STATS_FETCHED,
      data: stats,
    };
  }

  @Get('unit-charges')
  @ApiOperation({ summary: 'Get charges for units (accessible by residents)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unit charges retrieved successfully',
  })
  async getUnitCharges(
    @CurrentBuilding('id') buildingId: string,
    @Query() query: UnitChargeQueryDto,
  ) {
    const result = await this.chargesService.getUnitCharges(buildingId, query);
    return {
      success: true,
      message: MESSAGES.CHARGE.UNIT_CHARGES_FETCHED,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single charge by ID' })
  @ApiParam({ name: 'id', description: 'Charge UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Charge retrieved successfully',
    type: ChargeWithUnitsResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Charge not found' })
  async findOne(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') chargeId: string,
  ) {
    const charge = await this.chargesService.findOne(buildingId, chargeId);
    return {
      success: true,
      message: MESSAGES.CHARGE.FETCHED,
      data: charge,
    };
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Update a charge (only DRAFT status)' })
  @ApiParam({ name: 'id', description: 'Charge UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Charge updated successfully',
    type: ChargeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot update non-draft charge',
  })
  async update(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') chargeId: string,
    @Body() updateChargeDto: UpdateChargeDto,
  ) {
    const charge = await this.chargesService.update(
      buildingId,
      chargeId,
      updateChargeDto,
    );
    return {
      success: true,
      message: MESSAGES.CHARGE.UPDATED,
      data: charge,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Update charge status' })
  @ApiParam({ name: 'id', description: 'Charge UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  async updateStatus(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') chargeId: string,
    @Body() updateStatusDto: UpdateChargeStatusDto,
  ) {
    const charge = await this.chargesService.updateStatus(
      buildingId,
      chargeId,
      updateStatusDto,
    );
    return {
      success: true,
      message: MESSAGES.CHARGE.STATUS_UPDATED,
      data: charge,
    };
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a charge (only DRAFT status)' })
  @ApiParam({ name: 'id', description: 'Charge UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Charge deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete non-draft charge',
  })
  async delete(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') chargeId: string,
  ) {
    await this.chargesService.delete(buildingId, chargeId);
    return {
      success: true,
      message: MESSAGES.CHARGE.DELETED,
    };
  }
}
