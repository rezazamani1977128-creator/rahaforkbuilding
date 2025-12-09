import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ResidentQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'فیلتر بر اساس شماره واحد',
  })
  @IsOptional()
  @IsString()
  unitNumber?: string;

  @ApiPropertyOptional({
    description: 'فیلتر بر اساس طبقه',
  })
  @IsOptional()
  @IsString()
  floor?: string;
}

export class ResidentResponseDto {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  nationalId?: string;
  unit?: {
    id: string;
    number: string;
    floor: number;
  };
  role: string;
  createdAt: Date;
}
