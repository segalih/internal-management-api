import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateMsaDetailV2Dto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  role_id!: number;

  @IsString()
  name!: string;

  @IsString()
  project!: string;

  @IsString()
  group_position!: string;

  @IsDateString()
  join_date?: string;

  @IsDateString()
  @IsOptional()
  leave_date?: string;

  @IsBoolean()
  @IsOptional()
  is_active!: boolean;
}
