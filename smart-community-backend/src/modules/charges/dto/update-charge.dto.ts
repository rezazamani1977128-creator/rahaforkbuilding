import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateChargeDto } from './create-charge.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';

export class UpdateChargeDto extends PartialType(
  OmitType(CreateChargeDto, ['distributionMethod'] as const),
) {}

export class UpdateChargeStatusDto {
  @ApiPropertyOptional({
    description: 'وضعیت شارژ',
    enum: ChargeStatus,
  })
  @IsEnum(ChargeStatus, { message: 'وضعیت شارژ معتبر نیست' })
  status: ChargeStatus;
}
