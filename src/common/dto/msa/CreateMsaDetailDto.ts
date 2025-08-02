import { IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

export default class CreateMsaDetailDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  name!: string;

  @IsString()
  @Matches(/^\d+(\.\d+)?$/, {
    message: 'rate must be a string containing a positive number',
  })
  rate!: string;

  @IsString()
  role!: string;

  @IsString()
  project!: string;

  @IsString()
  group_position!: string;
}
