import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExpenseStatus } from '@prisma/client';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class ApproveExpenseDto {
  @ApiProperty({
    description: 'Approval status',
    enum: ExpenseStatus,
    example: ExpenseStatus.APPROVED,
  })
  @IsEnum(ExpenseStatus)
  status: ExpenseStatus;

  @ApiPropertyOptional({
    description: 'Approval note/reason',
    example: 'تأیید شد',
  })
  @IsOptional()
  @IsString()
  approvalNote?: string;
}
