import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

class PaymentUnitDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: '101' })
  number: string;

  @ApiProperty({ example: 1 })
  floor: number;
}

class PaymentChargeDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'شارژ آبان 1403' })
  title: string;

  @ApiProperty({ example: 'MONTHLY' })
  type: string;

  @ApiProperty({ example: '2024-11-30T00:00:00Z' })
  dueDate: Date;
}

class PaymentCreatorDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'علی' })
  firstName: string;

  @ApiProperty({ example: 'احمدی' })
  lastName: string;
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  buildingId: string;

  @ApiProperty({ example: 'uuid' })
  unitId: string;

  @ApiProperty({ example: 'uuid' })
  chargeId: string;

  @ApiPropertyOptional({ example: 'uuid' })
  chargeUnitItemId?: string;

  @ApiProperty({ example: 5000000, description: 'Payment amount in Rials' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.VERIFIED })
  status: PaymentStatus;

  @ApiPropertyOptional({ example: 'REF123456' })
  referenceNumber?: string;

  @ApiPropertyOptional({ example: 'TRX98765' })
  bankReferenceNumber?: string;

  @ApiPropertyOptional({ example: 'پرداخت نقدی' })
  note?: string;

  @ApiPropertyOptional({ example: 'تأیید شد' })
  verificationNote?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiPropertyOptional({ example: '2024-01-15T11:00:00Z' })
  verifiedAt?: Date;

  @ApiProperty({ type: PaymentUnitDto })
  unit: PaymentUnitDto;

  @ApiProperty({ type: PaymentChargeDto })
  charge: PaymentChargeDto;

  @ApiProperty({ type: PaymentCreatorDto })
  createdBy: PaymentCreatorDto;

  @ApiPropertyOptional({ type: PaymentCreatorDto })
  verifiedBy?: PaymentCreatorDto;
}

export class PaymentStatsDto {
  @ApiProperty({ example: 150, description: 'Total payment count' })
  totalPayments: number;

  @ApiProperty({ example: 50, description: 'Pending verification count' })
  pendingPayments: number;

  @ApiProperty({
    example: 250000000,
    description: 'Total verified amount in Rials',
  })
  totalVerified: number;

  @ApiProperty({
    example: 50000000,
    description: 'Total pending amount in Rials',
  })
  totalPending: number;
}
