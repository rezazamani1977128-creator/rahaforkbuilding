import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ExpenseStatus, ExpenseCategory } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class ExpenseQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ExpenseStatus,
    example: ExpenseStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ExpenseCategory,
    example: ExpenseCategory.MAINTENANCE,
  })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiPropertyOptional({
    description: 'Filter expenses from this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter expenses until this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Show only pending approval',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  pendingOnly?: boolean;
}
