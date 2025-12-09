import { IsNumber, IsUUID, IsOptional, IsString, Min, IsArray, ValidateNested, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CustomUnitChargeDto {
  @ApiProperty({
    description: 'شناسه واحد',
  })
  @IsUUID('4')
  unitId: string;

  @ApiProperty({
    description: 'مبلغ اختصاصی',
    example: 500000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'توضیحات',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateCustomChargeDto {
  @ApiProperty({
    description: 'عنوان شارژ',
    example: 'هزینه تعمیرات واحد',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'توضیحات',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'تاریخ سررسید',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'لیست واحدها و مبالغ',
    type: [CustomUnitChargeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomUnitChargeDto)
  units: CustomUnitChargeDto[];
}
