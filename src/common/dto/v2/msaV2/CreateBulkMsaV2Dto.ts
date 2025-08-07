import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import CreateMsaDetailV2Dto from './CreateMsaDetailV2Dto';

export class CreateBulkMsaV2Dto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMsaDetailV2Dto)
  public msa!: CreateMsaDetailV2Dto[];
}
