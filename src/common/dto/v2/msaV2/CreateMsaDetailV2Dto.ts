import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateMsaProjectV2Dto } from './CreateMsaProjectV2Dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMsaProjectV2Dto)
  public projects!: CreateMsaProjectV2Dto[];
}
