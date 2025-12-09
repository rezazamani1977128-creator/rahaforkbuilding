import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Iranian phone number',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'شماره تلفن الزامی است' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن نامعتبر است' })
  phone: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsNotEmpty({ message: 'کد تأیید الزامی است' })
  @IsString()
  @Length(6, 6, { message: 'کد تأیید باید ۶ رقم باشد' })
  code: string;
}
