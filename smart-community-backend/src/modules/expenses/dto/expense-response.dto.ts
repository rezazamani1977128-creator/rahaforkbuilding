import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseStatus, ExpenseCategory } from '@prisma/client';

class ExpenseCreatorDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'علی' })
  firstName: string;

  @ApiProperty({ example: 'احمدی' })
  lastName: string;
}

export class ExpenseResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  buildingId: string;

  @ApiProperty({ example: 'تعمیر آسانسور' })
  title: string;

  @ApiPropertyOptional({ example: 'تعمیر موتور آسانسور اصلی' })
  description?: string;

  @ApiProperty({ example: 25000000, description: 'Amount in Rials' })
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.MAINTENANCE })
  category: ExpenseCategory;

  @ApiProperty({ enum: ExpenseStatus, example: ExpenseStatus.PENDING })
  status: ExpenseStatus;

  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  expenseDate: Date;

  @ApiPropertyOptional({ example: 'شرکت آسانسور سازان' })
  vendor?: string;

  @ApiPropertyOptional({ example: 'INV-12345' })
  receiptNumber?: string;

  @ApiPropertyOptional({ example: 'پرداخت نقدی' })
  notes?: string;

  @ApiPropertyOptional({ example: 'تأیید شد' })
  approvalNote?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  createdAt: Date;

  @ApiPropertyOptional({ example: '2024-01-15T11:00:00Z' })
  approvedAt?: Date;

  @ApiProperty({ type: ExpenseCreatorDto })
  createdBy: ExpenseCreatorDto;

  @ApiPropertyOptional({ type: ExpenseCreatorDto })
  approvedBy?: ExpenseCreatorDto;
}

export class ExpenseStatsDto {
  @ApiProperty({ example: 120, description: 'Total expense count' })
  totalExpenses: number;

  @ApiProperty({ example: 15, description: 'Pending approval count' })
  pendingExpenses: number;

  @ApiProperty({
    example: 180000000,
    description: 'Total approved amount in Rials',
  })
  totalApproved: number;

  @ApiProperty({
    example: 20000000,
    description: 'Total pending amount in Rials',
  })
  totalPending: number;
}

export class CategorySummaryDto {
  @ApiProperty({ enum: ExpenseCategory })
  category: ExpenseCategory;

  @ApiProperty({ example: 50000000 })
  totalAmount: number;

  @ApiProperty({ example: 12 })
  count: number;
}
