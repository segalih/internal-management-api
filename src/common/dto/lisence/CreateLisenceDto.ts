import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateHealthcheckDto } from './CreateHealthcheckDto';
import { Type } from 'class-transformer';

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

  @IsString()
  @IsNotEmpty()
  file_pks!: string;

  @IsString()
  @IsNotEmpty()
  file_bast!: string;

  @IsBoolean()
  @IsOptional()
  is_notified!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHealthcheckDto)
  healthchecks?: CreateHealthcheckDto[];
}
