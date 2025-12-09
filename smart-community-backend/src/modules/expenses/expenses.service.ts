import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Expense,
  ExpenseStatus,
  FundTransactionType,
  Prisma,
} from '@prisma/client';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ApproveExpenseDto,
  ExpenseQueryDto,
} from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    buildingId: string,
    createDto: CreateExpenseDto,
    createdById: string,
  ): Promise<Expense> {
    return this.prisma.expense.create({
      data: {
        buildingId,
        createdById,
        title: createDto.title,
        description: createDto.description,
        amount: createDto.amount,
        category: createDto.category,
        expenseDate: new Date(createDto.expenseDate),
        vendor: createDto.vendor,
        receiptNumber: createDto.receiptNumber,
        status: ExpenseStatus.PENDING,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findAll(
    buildingId: string,
    query: ExpenseQueryDto,
  ): Promise<PaginatedResponseDto<Expense>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      fromDate,
      toDate,
      pendingOnly,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = { buildingId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;
    if (pendingOnly) where.status = ExpenseStatus.PENDING;

    if (fromDate || toDate) {
      where.expenseDate = {};
      if (fromDate) where.expenseDate.gte = new Date(fromDate);
      if (toDate) where.expenseDate.lte = new Date(toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
          approvedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.expense.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(buildingId: string, expenseId: string): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, buildingId },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        approvedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException(MESSAGES.EXPENSE.NOT_FOUND);
    }

    return expense;
  }

  async update(
    buildingId: string,
    expenseId: string,
    updateDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(buildingId, expenseId);

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException(
        'فقط هزینه‌های در انتظار تأیید قابل ویرایش هستند',
      );
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...updateDto,
        expenseDate: updateDto.expenseDate
          ? new Date(updateDto.expenseDate)
          : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async approve(
    buildingId: string,
    expenseId: string,
    approveDto: ApproveExpenseDto,
    approvedById: string,
  ): Promise<Expense> {
    const expense = await this.findOne(buildingId, expenseId);

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('این هزینه قبلاً بررسی شده است');
    }

    return this.prisma.$transaction(async (tx) => {
      // Update expense
      const updatedExpense = await tx.expense.update({
        where: { id: expenseId },
        data: {
          status: approveDto.status,
          approvedById,
          approvedAt: new Date(),
          approvalNote: approveDto.approvalNote,
        },
      });

      // If approved, update fund balance and create transaction
      if (approveDto.status === ExpenseStatus.APPROVED) {
        const fund = await tx.buildingFund.findUnique({
          where: { buildingId },
        });

        if (!fund) {
          throw new NotFoundException('صندوق ساختمان یافت نشد');
        }

        if (Number(fund.balance) < Number(expense.amount)) {
          throw new BadRequestException('موجودی صندوق کافی نیست');
        }

        await tx.buildingFund.update({
          where: { buildingId },
          data: {
            balance: { decrement: expense.amount },
          },
        });

        await tx.fundTransaction.create({
          data: {
            buildingId,
            fundId: fund.id,
            type: FundTransactionType.EXPENSE,
            amount: expense.amount,
            description: `هزینه ${expense.title} - ${expense.category}`,
            referenceType: 'EXPENSE',
            referenceId: expense.id,
            createdById: approvedById,
          },
        });
      }

      const result = await tx.expense.findUnique({
        where: { id: expenseId },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
          approvedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
      
      if (!result) {
        throw new NotFoundException(MESSAGES.EXPENSE.NOT_FOUND);
      }
      
      return result as Expense;
    });
  }

  async delete(buildingId: string, expenseId: string): Promise<void> {
    const expense = await this.findOne(buildingId, expenseId);

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('فقط هزینه‌های در انتظار تأیید قابل حذف هستند');
    }

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });
  }

  async getExpenseStats(buildingId: string) {
    const [totalExpenses, pendingExpenses, approvedAgg, pendingAgg] =
      await Promise.all([
        this.prisma.expense.count({ where: { buildingId } }),
        this.prisma.expense.count({
          where: { buildingId, status: ExpenseStatus.PENDING },
        }),
        this.prisma.expense.aggregate({
          where: { buildingId, status: ExpenseStatus.APPROVED },
          _sum: { amount: true },
        }),
        this.prisma.expense.aggregate({
          where: { buildingId, status: ExpenseStatus.PENDING },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalExpenses,
      pendingExpenses,
      totalApproved: approvedAgg._sum.amount || 0,
      totalPending: pendingAgg._sum.amount || 0,
    };
  }

  async getCategorySummary(buildingId: string) {
    const expenses = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        buildingId,
        status: ExpenseStatus.APPROVED,
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    return expenses.map((item) => ({
      category: item.category,
      totalAmount: item._sum.amount || 0,
      count: item._count,
    }));
  }
}
