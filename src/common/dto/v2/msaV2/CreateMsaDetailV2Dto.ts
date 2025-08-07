import { IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

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
}
