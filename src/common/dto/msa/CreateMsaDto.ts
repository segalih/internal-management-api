import { IsDateString, IsNumber, IsPositive, IsString, Matches } from 'class-validator';

export default class CreateMsaDto {
  @IsString()
  pks!: string;

  @IsDateString()
  date_started!: Date;

  @IsDateString()
  date_ended!: Date;

  @IsString()
  @Matches(/^\d+(\.\d+)?$/, {
    message: 'people_quota must be a string containing a positive number',
  })
  people_quota!: number;

  @IsString()
  @Matches(/^\d+(\.\d+)?$/, {
    message: 'people_quota must be a string containing a positive number',
  })
  budget_quota!: number;
}
