import { IsString } from 'class-validator';

export class CreateMsaProjectV2Dto {
  @IsString()
  project!: string;

  @IsString()
  team_leader!: string;
}
