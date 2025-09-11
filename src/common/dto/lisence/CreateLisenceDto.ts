import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateHealthcheckDto } from './CreateHealthcheckDto';
import { IsDataExist } from '@helper/dto/is-data-exist.decorator';
import MasterVendorApplication from '@database/models/masters/master_vendor_application.model';

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
  @IsOptional()
  date_started?: string;

  @IsDateString()
  due_date_license!: string;

  @IsNumber()
  @IsOptional()
  @IsDataExist(MasterVendorApplication, 'id', {
    message: 'vendor_id does not exist',
  })
  vendor_id?: number;

  @IsString()
  @IsOptional()
  descriptions!: string;

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
