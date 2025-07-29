import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLisenceDto {
  @IsString()
  pks!: string;

  @IsString()
  bast!: string;

  @IsString()
  aplikasi!: string;

  @IsDateString()
  @IsOptional()
  due_date_license!: Date;

  @IsDateString()
  @IsOptional()
  health_check_routine!: Date;

  @IsDateString()
  @IsOptional()
  health_check_actual!: Date;
}
