import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  errors?: string[];

  static success<T>(data: T, message?: string): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.data = data;
    response.message = message;
    return response;
  }

  static error(message: string, errors?: string[]): ApiResponseDto<null> {
    const response = new ApiResponseDto<null>();
    response.success = false;
    response.message = message;
    response.errors = errors;
    return response;
  }
}
