import { IsNotEmpty, IsString, IsOptional, IsEmail, Matches, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '09123456789' })
  @IsNotEmpty({ message: 'شماره تلفن الزامی است' })
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن نامعتبر است' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'کد تأیید الزامی است' })
  @Length(6, 6, { message: 'کد تأیید باید ۶ رقم باشد' })
  code: string;

  @ApiProperty({ example: 'علی' })
  @IsNotEmpty({ message: 'نام الزامی است' })
  @IsString()
  @Length(2, 50, { message: 'نام باید بین ۲ تا ۵۰ حرف باشد' })
  firstName: string;

  @ApiProperty({ example: 'محمدی' })
  @IsNotEmpty({ message: 'نام خانوادگی الزامی است' })
  @IsString()
  @Length(2, 50, { message: 'نام خانوادگی باید بین ۲ تا ۵۰ حرف باشد' })
  lastName: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'ایمیل نامعتبر است' })
  email?: string;

  @ApiPropertyOptional({ example: '0012345678' })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'کد ملی باید ۱۰ رقم باشد' })
  nationalId?: string;
}
