import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FundService } from './fund.service';
import {
  FundQueryDto,
  FundResponseDto,
  FundTransactionResponseDto,
  FundStatsDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAdjustmentDto {
  @ApiProperty({ description: 'Amount (positive or negative)', example: 5000000 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Description of adjustment',
    example: 'تعدیل موجودی',
  })
  @IsString()
  @MinLength(3)
  description: string;
}

@ApiTags('Fund')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Get()
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get building fund details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fund details retrieved successfully',
    type: FundResponseDto,
  })
  async getFund(@CurrentBuilding('id') buildingId: string) {
    const fund = await this.fundService.getFund(buildingId);
    return {
      success: true,
      message: MESSAGES.FUND.FETCHED,
      data: fund,
    };
  }

  @Get('transactions')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get fund transactions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
  })
  async getTransactions(
    @CurrentBuilding('id') buildingId: string,
    @Query() query: FundQueryDto,
  ) {
    const result = await this.fundService.getTransactions(buildingId, query);
    return {
      success: true,
      message: MESSAGES.FUND.TRANSACTIONS_FETCHED,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get fund statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
    type: FundStatsDto,
  })
  async getStats(@CurrentBuilding('id') buildingId: string) {
    const stats = await this.fundService.getStats(buildingId);
    return {
      success: true,
      message: MESSAGES.FUND.STATS_FETCHED,
      data: stats,
    };
  }

  @Post('adjustment')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a manual fund adjustment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Adjustment created successfully',
    type: FundTransactionResponseDto,
  })
  async createAdjustment(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateAdjustmentDto,
  ) {
    const transaction = await this.fundService.createAdjustmentTransaction(
      buildingId,
      createDto.amount,
      createDto.description,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.FUND.ADJUSTMENT_CREATED,
      data: transaction,
    };
  }
}
