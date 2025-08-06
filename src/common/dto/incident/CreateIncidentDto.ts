import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsDateString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
  @IsString()
  @IsOptional()
  ticket_number!: string;

  @IsDateString()
  @IsOptional()
  entry_date!: string;

  @IsNumber()
  @Type(() => Number)
  application_id!: number;

  @IsNumber()
  @Type(() => Number)
  person_in_charge_id!: number;

  @IsString()
  @IsNotEmpty()
  issue_code!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  detail!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status_id!: number;

  @IsString()
  @IsOptional()
  temporary_action?: string;

  @IsString()
  @IsOptional()
  full_action?: string;

  @IsString()
  @IsOptional()
  root_cause_reason?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  root_cause?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  link?: string[];
}
