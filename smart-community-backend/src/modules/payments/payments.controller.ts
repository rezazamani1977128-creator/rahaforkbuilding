import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDto,
  CreateBulkPaymentDto,
  VerifyPaymentDto,
  PaymentQueryDto,
  PaymentResponseDto,
  PaymentStatsDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  async create(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createDto: CreatePaymentDto,
  ) {
    const payment = await this.paymentsService.create(
      buildingId,
      createDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.PAYMENT.CREATED,
      data: payment,
    };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create bulk payments for multiple charges' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bulk payments created successfully',
  })
  async createBulk(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateBulkPaymentDto,
  ) {
    const payments = await this.paymentsService.createBulkPayment(
      buildingId,
      createDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.PAYMENT.BULK_CREATED,
      data: payments,
    };
  }

  @Patch(':id/verify')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Verify or reject a payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment verified successfully',
    type: PaymentResponseDto,
  })
  async verify(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Param('id') paymentId: string,
    @Body() verifyDto: VerifyPaymentDto,
  ) {
    const payment = await this.paymentsService.verify(
      buildingId,
      paymentId,
      verifyDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.PAYMENT.VERIFIED,
      data: payment,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments retrieved successfully',
  })
  async findAll(
    @CurrentBuilding('id') buildingId: string,
    @Query() query: PaymentQueryDto,
  ) {
    const result = await this.paymentsService.findAll(buildingId, query);
    return {
      success: true,
      message: MESSAGES.PAYMENT.FETCHED,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get payment statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
    type: PaymentStatsDto,
  })
  async getStats(@CurrentBuilding('id') buildingId: string) {
    const stats = await this.paymentsService.getPaymentStats(buildingId);
    return {
      success: true,
      message: MESSAGES.PAYMENT.STATS_FETCHED,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment retrieved successfully',
    type: PaymentResponseDto,
  })
  async findOne(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') paymentId: string,
  ) {
    const payment = await this.paymentsService.findOne(buildingId, paymentId);
    return {
      success: true,
      message: MESSAGES.PAYMENT.FETCHED,
      data: payment,
    };
  }
}
