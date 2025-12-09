import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PaymentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by unit ID', example: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  unitId?: string;

  @ApiPropertyOptional({ description: 'Filter by charge ID', example: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  chargeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: PaymentStatus,
    example: PaymentStatus.VERIFIED,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Filter by payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Filter payments from this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter payments until this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Show only pending verification',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  pendingOnly?: boolean;
}
