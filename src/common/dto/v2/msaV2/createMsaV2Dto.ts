import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateRoleDto } from './createRoleDto';

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
  people_quota!: string;

  @IsNumber()
  budget_quota!: string;

  @IsArray()
  roles!: CreateRoleDto[];
}
