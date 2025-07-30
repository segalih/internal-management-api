import { IsDecimal, IsString } from 'class-validator';

export default class CreateMsaDetailDto {
  @IsString()
  name!: string;

  @IsDecimal({
    decimal_digits: '12,2',
  })
  rate!: number;

  @IsString()
  role!: string;

  @IsString()
  project!: string;

  @IsString()
  group_position!: string;
}
