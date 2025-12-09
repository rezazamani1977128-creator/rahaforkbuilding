import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUnitDto {
  @ApiProperty({
    description: 'شماره واحد',
    example: '101',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  number: string;

  @ApiPropertyOptional({
    description: 'طبقه',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({
    description: 'متراژ (متر مربع)',
    example: 150,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  area?: number;

  @ApiPropertyOptional({
    description: 'ضریب',
    example: 1.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  coefficient?: number;
}

export class UpdateUnitDto {
  @ApiPropertyOptional({
    description: 'شماره واحد',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  number?: string;

  @ApiPropertyOptional({
    description: 'طبقه',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({
    description: 'متراژ',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  area?: number;

  @ApiPropertyOptional({
    description: 'ضریب',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  coefficient?: number;
}
