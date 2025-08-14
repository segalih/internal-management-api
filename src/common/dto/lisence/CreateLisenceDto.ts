import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLisenceDto {
  @IsString()
  @IsNotEmpty()
  pks!: string;

  @IsOptional()
  @IsString()
  file_pks_id?: number;

  @IsOptional()
  @IsString()
  file_bast_id?: number;

  @IsString()
  @IsNotEmpty()
  application!: string;

  @IsDateString()
  due_date_license!: string;

  @IsDateString()
  health_check_routine!: string;

  @IsDateString()
  health_check_actual!: string;

  @IsString()
  @IsNotEmpty()
  file_pks!: string;

  @IsString()
  @IsNotEmpty()
  file_bast!: string;

  @IsBoolean()
  @IsOptional()
  is_notified!: boolean;
}
