import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChargeStatus, ChargeDistributionMethod } from '@prisma/client';

export class ChargeItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiPropertyOptional()
  description?: string;
}

export class ChargeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ enum: ChargeDistributionMethod })
  distributionMethod: ChargeDistributionMethod;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  dueDate: Date;

  @ApiPropertyOptional()
  periodStart?: Date;

  @ApiPropertyOptional()
  periodEnd?: Date;

  @ApiPropertyOptional()
  lateFeePercentage?: number;

  @ApiProperty({ enum: ChargeStatus })
  status: ChargeStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: [ChargeItemResponseDto] })
  items?: ChargeItemResponseDto[];
}

export class ChargeUnitItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chargeId: string;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  unitNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  remainingAmount: number;

  @ApiProperty()
  lateFee: number;

  @ApiProperty()
  isPaid: boolean;

  @ApiPropertyOptional()
  paidAt?: Date;

  @ApiPropertyOptional()
  note?: string;
}

export class ChargeWithUnitsResponseDto extends ChargeResponseDto {
  @ApiProperty({ type: [ChargeUnitItemResponseDto] })
  unitCharges: ChargeUnitItemResponseDto[];

  @ApiProperty()
  totalPaid: number;

  @ApiProperty()
  totalRemaining: number;

  @ApiProperty()
  paidUnitsCount: number;

  @ApiProperty()
  totalUnitsCount: number;
}
