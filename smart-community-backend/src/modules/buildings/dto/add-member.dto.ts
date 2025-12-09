import { IsString, IsEnum, IsUUID, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class AddMemberDto {
  @ApiProperty({
    description: 'شماره تلفن کاربر',
    example: '09120000000',
  })
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  phone: string;

  @ApiProperty({
    description: 'نقش کاربر در ساختمان',
    enum: UserRole,
    example: UserRole.OWNER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description: 'شناسه‌های واحدهایی که کاربر مالک آنهاست',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds?: string[];
}
