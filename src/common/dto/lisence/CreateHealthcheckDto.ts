import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHealthcheckDto {
  @IsDateString()
  @IsNotEmpty()
  healthcheck_routine_date!: string;

  @IsDateString()
  @IsOptional()
  healthcheck_actual_date?: string;
}
