import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CreateMsaProjectV2Dto } from './CreateMsaProjectV2Dto';
import { UniqueProjectNameConstraint } from '@helper/dto/dtoHelper';

export default class CreateMsaDetailV2Dto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  role_id!: number;

  @IsString()
  name!: string;

  @Matches(/^\d{15,16}$/, { message: 'NIK harus terdiri dari 15 atau 16 digit angka' })
  nik!: string;

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

  @IsString()
  vendor!: string;

  @IsString()
  department!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMsaProjectV2Dto)
  @Validate(UniqueProjectNameConstraint, { message: 'Duplicate project name is not allowed' })
  public projects!: CreateMsaProjectV2Dto[];
}
