import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Verification status',
    enum: PaymentStatus,
    example: PaymentStatus.VERIFIED,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Verification note/reason',
    example: 'رسید بانکی تأیید شد',
  })
  @IsOptional()
  @IsString()
  verificationNote?: string;

  @ApiPropertyOptional({
    description: 'Reference number if missing',
    example: 'REF123456',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;
}
