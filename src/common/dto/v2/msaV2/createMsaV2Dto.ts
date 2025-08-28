import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';
import { CreateRoleDto } from './createRoleDto';
import { UniqueRoleConstraint } from '@helper/dto/dtoHelper';

export class CreateMsaV2Dto {
  @IsString()
  pks!: string;

  @IsString()
  @IsOptional()
  file_pks?: string;

  @IsString()
  @IsOptional()
  file_bast?: string;

  @IsDateString()
  date_started!: string;

  @IsDateString()
  date_ended!: string;

  @IsNumber()
  @Min(1, {
    message: 'people_quota must be a positive number',
  })
  people_quota!: number;

  @IsNumber()
  @Min(1, {
    message: 'budget_quota must be a positive number',
  })
  budget_quota!: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'roles must contain at least one role',
  })
  @Validate(UniqueRoleConstraint, { message: 'Duplicate role is not allowed' })
  roles!: CreateRoleDto[];

  @IsOptional()
  @IsNumber()
  threshold_alert?: number;
}
