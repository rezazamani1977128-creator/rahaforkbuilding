import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'شماره تلفن کاربر',
    example: '09120000000',
  })
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تلفن باید با 09 شروع شود و 11 رقم باشد',
  })
  phone: string;

  @ApiProperty({
    description: 'نام کاربر',
    example: 'علی',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'نام خانوادگی کاربر',
    example: 'محمدی',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({
    description: 'ایمیل کاربر',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'شماره ملی',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'شماره ملی باید 10 رقم باشد' })
  nationalId?: string;

  @ApiPropertyOptional({
    description: 'وضعیت کاربر',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
