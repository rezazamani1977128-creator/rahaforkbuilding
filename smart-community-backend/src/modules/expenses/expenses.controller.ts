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
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ApproveExpenseDto,
  ExpenseQueryDto,
  ExpenseResponseDto,
  ExpenseStatsDto,
  CategorySummaryDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBuilding } from '../../common/decorators/current-building.decorator';
import { UserRole } from '../../common/constants/roles.constants';
import { MESSAGES } from '../../common/constants/messages.constants';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expense created successfully',
    type: ExpenseResponseDto,
  })
  async create(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateExpenseDto,
  ) {
    const expense = await this.expensesService.create(
      buildingId,
      createDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.EXPENSE.CREATED,
      data: expense,
    };
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expenses retrieved successfully',
  })
  async findAll(
    @CurrentBuilding('id') buildingId: string,
    @Query() query: ExpenseQueryDto,
  ) {
    const result = await this.expensesService.findAll(buildingId, query);
    return {
      success: true,
      message: MESSAGES.EXPENSE.FETCHED,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get expense statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
    type: ExpenseStatsDto,
  })
  async getStats(@CurrentBuilding('id') buildingId: string) {
    const stats = await this.expensesService.getExpenseStats(buildingId);
    return {
      success: true,
      message: MESSAGES.EXPENSE.STATS_FETCHED,
      data: stats,
    };
  }

  @Get('category-summary')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get expenses summary by category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category summary retrieved successfully',
    type: [CategorySummaryDto],
  })
  async getCategorySummary(@CurrentBuilding('id') buildingId: string) {
    const summary = await this.expensesService.getCategorySummary(buildingId);
    return {
      success: true,
      message: MESSAGES.EXPENSE.CATEGORY_SUMMARY_FETCHED,
      data: summary,
    };
  }

  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Get a single expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense retrieved successfully',
    type: ExpenseResponseDto,
  })
  async findOne(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') expenseId: string,
  ) {
    const expense = await this.expensesService.findOne(buildingId, expenseId);
    return {
      success: true,
      message: MESSAGES.EXPENSE.FETCHED,
      data: expense,
    };
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @ApiOperation({ summary: 'Update an expense (only PENDING status)' })
  @ApiParam({ name: 'id', description: 'Expense UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense updated successfully',
    type: ExpenseResponseDto,
  })
  async update(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') expenseId: string,
    @Body() updateDto: UpdateExpenseDto,
  ) {
    const expense = await this.expensesService.update(
      buildingId,
      expenseId,
      updateDto,
    );
    return {
      success: true,
      message: MESSAGES.EXPENSE.UPDATED,
      data: expense,
    };
  }

  @Patch(':id/approve')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Approve or reject an expense' })
  @ApiParam({ name: 'id', description: 'Expense UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense approved/rejected successfully',
    type: ExpenseResponseDto,
  })
  async approve(
    @CurrentBuilding('id') buildingId: string,
    @CurrentUser('id') userId: string,
    @Param('id') expenseId: string,
    @Body() approveDto: ApproveExpenseDto,
  ) {
    const expense = await this.expensesService.approve(
      buildingId,
      expenseId,
      approveDto,
      userId,
    );
    return {
      success: true,
      message: MESSAGES.EXPENSE.APPROVED,
      data: expense,
    };
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.BOARD_MEMBER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense (only PENDING status)' })
  @ApiParam({ name: 'id', description: 'Expense UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Expense deleted successfully',
  })
  async delete(
    @CurrentBuilding('id') buildingId: string,
    @Param('id') expenseId: string,
  ) {
    await this.expensesService.delete(buildingId, expenseId);
    return {
      success: true,
      message: MESSAGES.EXPENSE.DELETED,
    };
  }
}
