import { IsDateString, IsNumber, IsPositive, IsString } from 'class-validator';

export default class CreateMsaDto {
  @IsString()
  pks!: string;

  @IsString()
  bast!: string;

  @IsDateString()
  date_started!: Date;

  @IsDateString()
  date_ended!: Date;

  @IsPositive()
  @IsNumber()
  people_quota!: number;

  @IsPositive()
  @IsNumber()
  budget_quota!: number;
}
