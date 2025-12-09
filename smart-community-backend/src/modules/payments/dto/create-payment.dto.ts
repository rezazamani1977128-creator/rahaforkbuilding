import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Unit ID', example: 'uuid' })
  @IsUUID('4')
  unitId: string;

  @ApiProperty({ description: 'Charge ID', example: 'uuid' })
  @IsUUID('4')
  chargeId: string;

  @ApiPropertyOptional({
    description: 'Specific charge unit item ID (optional)',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  chargeUnitItemId?: string;

  @ApiProperty({ description: 'Payment amount in Rials', example: 5000000, minimum: 1000 })
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Bank reference/tracking number',
    example: 'TRX12345678',
  })
  @IsOptional()
  @IsString()
  bankReferenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Additional note',
    example: 'پرداخت نقدی در دفتر مجتمع',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkPaymentItemDto {
  @ApiProperty({ description: 'Charge unit item ID', example: 'uuid' })
  @IsUUID('4')
  chargeUnitItemId: string;

  @ApiProperty({ description: 'Payment amount', example: 5000000 })
  @IsNumber()
  @Min(1000)
  amount: number;
}

export class CreateBulkPaymentDto {
  @ApiProperty({ description: 'Unit ID', example: 'uuid' })
  @IsUUID('4')
  unitId: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.ONLINE,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'Array of charge items to pay',
    type: [BulkPaymentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkPaymentItemDto)
  items: BulkPaymentItemDto[];

  @ApiPropertyOptional({
    description: 'Bank reference number for all payments',
    example: 'TRX12345678',
  })
  @IsOptional()
  @IsString()
  bankReferenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Note for bulk payment',
    example: 'پرداخت اینترنتی تمامی شارژها',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
