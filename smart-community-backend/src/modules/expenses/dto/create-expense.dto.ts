import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  MinLength,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ExpenseCategory } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense title',
    example: 'تعمیر آسانسور',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description',
    example: 'تعمیر موتور آسانسور اصلی',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Expense amount in Rials',
    example: 25000000,
    minimum: 1000,
  })
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiProperty({
    description: 'Expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.MAINTENANCE,
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Expense date',
    example: '2024-01-15',
  })
  @IsDateString()
  expenseDate: string;

  @ApiPropertyOptional({
    description: 'Vendor/supplier name',
    example: 'شرکت آسانسور سازان',
  })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional({
    description: 'Invoice/receipt number',
    example: 'INV-12345',
  })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'پرداخت نقدی انجام شد',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
