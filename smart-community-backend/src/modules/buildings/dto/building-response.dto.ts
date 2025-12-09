import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan, UserRole } from '@prisma/client';

export class BuildingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  totalFloors?: number;

  @ApiProperty({ enum: SubscriptionPlan })
  subscriptionPlan: SubscriptionPlan;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UnitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: string;

  @ApiPropertyOptional()
  floor?: number;

  @ApiPropertyOptional()
  area?: number;

  @ApiPropertyOptional()
  coefficient?: number;

  @ApiProperty()
  createdAt: Date;
}

export class BuildingMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  userPhone: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
