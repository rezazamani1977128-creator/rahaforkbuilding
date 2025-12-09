import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SubscriptionPlan } from '@prisma/client';

export class CreateBuildingDto {
  @ApiProperty({
    description: 'نام ساختمان',
    example: 'برج مسکونی آریا',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'آدرس',
    example: 'تهران، خیابان ولیعصر',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({
    description: 'شهر',
    example: 'تهران',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'تعداد طبقات',
    example: 15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalFloors?: number;

  @ApiPropertyOptional({
    description: 'طرح اشتراک',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.BASIC,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;
}

export class UpdateBuildingDto {
  @ApiPropertyOptional({
    description: 'نام ساختمان',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({
    description: 'آدرس',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({
    description: 'شهر',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'تعداد طبقات',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalFloors?: number;

  @ApiPropertyOptional({
    description: 'طرح اشتراک',
    enum: SubscriptionPlan,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;
}
