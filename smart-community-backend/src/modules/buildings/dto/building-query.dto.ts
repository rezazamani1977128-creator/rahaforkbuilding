import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BuildingQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'فیلتر بر اساس طرح اشتراک',
    enum: SubscriptionPlan,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;
}

export class UnitQueryDto extends PaginationDto {}

export class MemberQueryDto extends PaginationDto {}
