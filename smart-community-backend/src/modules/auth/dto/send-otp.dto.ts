import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Iranian phone number',
    example: '09123456789',
  })
  @IsNotEmpty({ message: 'شماره تلفن الزامی است' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن نامعتبر است' })
  phone: string;
}
