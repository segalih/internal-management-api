import { IsString } from 'class-validator';

export class CreateMsaProjectV2Dto {
  @IsString()
  name!: string;

  @IsString()
  team_leader!: string;
}
