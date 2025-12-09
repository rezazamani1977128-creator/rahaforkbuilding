import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  nationalId?: string;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserWithBuildingsResponseDto extends UserResponseDto {
  @ApiProperty({
    description: 'لیست ساختمانهایی که کاربر عضو آنهاست',
    type: 'array',
  })
  buildings?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}
