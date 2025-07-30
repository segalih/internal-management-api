import { IsNumber, IsPositive, IsString } from 'class-validator';

export default class CreateMsaDetailDto {
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  rate!: number;

  @IsString()
  role!: string;

  @IsString()
  project!: string;

  @IsString()
  group_position!: string;
}
