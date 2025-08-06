import { IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  public role!: string;

  @IsNumber()
  public rate!: number;
}
