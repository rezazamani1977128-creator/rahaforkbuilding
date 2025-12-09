import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ChargeDistributionMethod } from '@prisma/client';

export class ChargeItemDto {
  @ApiProperty({
    description: 'عنوان آیتم',
    example: 'شارژ ماهانه',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'مبلغ آیتم',
    example: 500000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'توضیحات آیتم',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreateChargeDto {
  @ApiProperty({
    description: 'عنوان شارژ',
    example: 'شارژ فروردین ۱۴۰۳',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    description: 'توضیحات',
    example: 'شارژ ماهانه شامل نظافت و نگهبانی',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'نوع شارژ',
    example: 'MONTHLY',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'روش توزیع',
    enum: ChargeDistributionMethod,
    example: ChargeDistributionMethod.EQUAL,
  })
  @IsEnum(ChargeDistributionMethod)
  distributionMethod: ChargeDistributionMethod;

  @ApiProperty({
    description: 'مبلغ کل',
    example: 10000000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1000, { message: 'مبلغ باید حداقل ۱۰۰۰ تومان باشد' })
  totalAmount: number;

  @ApiProperty({
    description: 'تاریخ سررسید',
    example: '2024-02-15T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiPropertyOptional({
    description: 'تاریخ شروع دوره',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  periodStart?: Date;

  @ApiPropertyOptional({
    description: 'تاریخ پایان دوره',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  periodEnd?: Date;

  @ApiPropertyOptional({
    description: 'درصد جریمه دیرکرد',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  lateFeePercentage?: number;

  @ApiPropertyOptional({
    description: 'آیتم‌های شارژ',
    type: [ChargeItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeItemDto)
  items?: ChargeItemDto[];
}
