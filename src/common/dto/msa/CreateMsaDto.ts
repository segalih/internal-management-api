import { IsArray, IsDateString, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import CreateMsaDetailDto from './CreateMsaDetailDto';

export default class CreateMsaDto {
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

  @IsString()
  @Matches(/^\d+(\.\d+)?$/, {
    message: 'people_quota must be a string containing a positive number',
  })
  people_quota!: string;

  @IsString()
  @Matches(/^\d+(\.\d+)?$/, {
    message: 'budget_quota must be a string containing a positive number',
  })
  budget_quota!: string;

  @IsArray()
  @IsOptional()
  details!: CreateMsaDetailDto[];
}
