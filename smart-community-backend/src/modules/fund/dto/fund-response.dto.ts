import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FundTransactionType } from '@prisma/client';

class TransactionCreatorDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'علی' })
  firstName: string;

  @ApiProperty({ example: 'احمدی' })
  lastName: string;
}

export class FundTransactionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  buildingId: string;

  @ApiProperty({ example: 'uuid' })
  fundId: string;

  @ApiProperty({ enum: FundTransactionType, example: FundTransactionType.INCOME })
  type: FundTransactionType;

  @ApiProperty({ example: 5000000, description: 'Transaction amount in Rials' })
  amount: number;

  @ApiProperty({ example: 'پرداخت شارژ - CASH-1234567890' })
  description: string;

  @ApiPropertyOptional({ example: 'PAYMENT' })
  referenceType?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  referenceId?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ type: TransactionCreatorDto })
  createdBy: TransactionCreatorDto;
}

export class FundResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  buildingId: string;

  @ApiProperty({ example: 'صندوق ساختمان' })
  name: string;

  @ApiProperty({ example: 150000000, description: 'Current balance in Rials' })
  balance: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T12:00:00Z' })
  updatedAt: Date;
}

export class FundStatsDto {
  @ApiProperty({ example: 150000000, description: 'Current balance' })
  currentBalance: number;

  @ApiProperty({ example: 250000000, description: 'Total income' })
  totalIncome: number;

  @ApiProperty({ example: 100000000, description: 'Total expenses' })
  totalExpenses: number;

  @ApiProperty({ example: 5000000, description: 'Total adjustments' })
  totalAdjustments: number;

  @ApiProperty({ example: 320, description: 'Total transaction count' })
  transactionCount: number;
}
