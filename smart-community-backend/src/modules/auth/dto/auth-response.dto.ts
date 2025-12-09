import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  status: string;
}

export class BuildingMembershipDto {
  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  buildingName: string;

  @ApiProperty()
  role: string;

  @ApiPropertyOptional()
  unitNumber?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty({ type: [BuildingMembershipDto] })
  buildings: BuildingMembershipDto[];
}

export class OtpResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  expiresIn: number;
}

export class VerifyOtpResponseDto {
  @ApiProperty()
  isNewUser: boolean;

  @ApiPropertyOptional()
  auth?: AuthResponseDto;
}
