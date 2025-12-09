import { IsOptional, IsEnum, IsUUID, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ChargeStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ChargeQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'وضعیت شارژ',
    enum: ChargeStatus,
  })
  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;

  @ApiPropertyOptional({
    description: 'نوع شارژ',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'فیلتر شارژهای معوق',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  overdue?: boolean;
}

export class UnitChargeQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'شناسه واحد',
  })
  @IsOptional()
  @IsUUID('4')
  unitId?: string;

  @ApiPropertyOptional({
    description: 'فقط پرداخت نشده',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unpaidOnly?: boolean;

  @ApiPropertyOptional({
    description: 'وضعیت شارژ',
    enum: ChargeStatus,
  })
  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;
}
