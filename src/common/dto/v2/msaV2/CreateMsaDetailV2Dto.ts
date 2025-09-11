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
import { IsDataExist } from '@helper/dto/is-data-exist.decorator';
import MasterGroup from '@database/models/masters/master_group.model';
import MasterDepartment from '@database/models/masters/master_department.model';
import MasterVendor from '@database/models/masters/master_vendor.model';

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

  @IsDateString()
  join_date?: string;

  @IsDateString()
  @IsOptional()
  leave_date?: string;

  @IsBoolean()
  @IsOptional()
  is_active!: boolean;

  @IsNumber()
  @IsOptional()
  @IsDataExist(MasterGroup, 'id', { message: 'group_id does not exist' })
  group_id?: number;

  @IsNumber()
  @IsOptional()
  @IsDataExist(MasterDepartment, 'id', { message: 'department_id does not exist' })
  department_id?: number;

  @IsNumber()
  @IsOptional()
  @IsDataExist(MasterVendor, 'id', { message: 'vendor_id does not exist' })
  vendor_id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMsaProjectV2Dto)
  @Validate(UniqueProjectNameConstraint, { message: 'Duplicate project name is not allowed' })
  public projects!: CreateMsaProjectV2Dto[];
}
