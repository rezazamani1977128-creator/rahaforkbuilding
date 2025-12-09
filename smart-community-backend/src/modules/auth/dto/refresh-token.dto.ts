import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'توکن الزامی است' })
  @IsString()
  refreshToken: string;
}
