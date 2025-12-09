import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BuildingFund,
  FundTransaction,
  FundTransactionType,
  Prisma,
} from '@prisma/client';
import { FundQueryDto } from './dto';
import { MESSAGES } from '../../common/constants/messages.constants';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class FundService {
  constructor(private readonly prisma: PrismaService) {}

  async getFund(buildingId: string): Promise<BuildingFund> {
    const fund = await this.prisma.buildingFund.findUnique({
      where: { buildingId },
    });

    if (!fund) {
      throw new NotFoundException(MESSAGES.FUND.NOT_FOUND);
    }

    return fund;
  }

  async getTransactions(
    buildingId: string,
    query: FundQueryDto,
  ): Promise<PaginatedResponseDto<FundTransaction>> {
    const { page = 1, limit = 10, search, type, fromDate, toDate } = query;
    const skip = (page - 1) * limit;

    const fund = await this.getFund(buildingId);

    const where: Prisma.FundTransactionWhereInput = { fundId: fund.id };

    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.fundTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.fundTransaction.count({ where }),
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

  async getStats(buildingId: string) {
    const fund = await this.getFund(buildingId);

    const [incomeAgg, expenseAgg, adjustmentAgg, transactionCount] =
      await Promise.all([
        this.prisma.fundTransaction.aggregate({
          where: { fundId: fund.id, type: FundTransactionType.INCOME },
          _sum: { amount: true },
        }),
        this.prisma.fundTransaction.aggregate({
          where: { fundId: fund.id, type: FundTransactionType.EXPENSE },
          _sum: { amount: true },
        }),
        this.prisma.fundTransaction.aggregate({
          where: { fundId: fund.id, type: FundTransactionType.ADJUSTMENT },
          _sum: { amount: true },
        }),
        this.prisma.fundTransaction.count({ where: { fundId: fund.id } }),
      ]);

    return {
      currentBalance: fund.balance,
      totalIncome: incomeAgg._sum.amount || 0,
      totalExpenses: expenseAgg._sum.amount || 0,
      totalAdjustments: adjustmentAgg._sum.amount || 0,
      transactionCount,
    };
  }

  async createAdjustmentTransaction(
    buildingId: string,
    amount: number,
    description: string,
    createdById: string,
  ): Promise<FundTransaction> {
    const fund = await this.getFund(buildingId);

    return this.prisma.$transaction(async (tx) => {
      await tx.buildingFund.update({
        where: { id: fund.id },
        data: {
          balance: { increment: amount },
        },
      });

      return tx.fundTransaction.create({
        data: {
          buildingId,
          fundId: fund.id,
          type: FundTransactionType.ADJUSTMENT,
          amount: Math.abs(amount),
          description,
          createdById,
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
    });
  }
}
