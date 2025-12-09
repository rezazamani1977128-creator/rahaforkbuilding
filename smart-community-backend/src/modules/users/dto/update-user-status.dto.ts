import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'وضعیت جدید کاربر',
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
