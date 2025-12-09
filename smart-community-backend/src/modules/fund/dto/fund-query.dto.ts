import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { FundTransactionType } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FundQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by transaction type',
    enum: FundTransactionType,
    example: FundTransactionType.INCOME,
  })
  @IsOptional()
  @IsEnum(FundTransactionType)
  type?: FundTransactionType;

  @ApiPropertyOptional({
    description: 'Filter transactions from this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter transactions until this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
