import { Type } from 'class-transformer';
import { IsArray, Validate, ValidateNested } from 'class-validator';
import CreateMsaDetailV2Dto from './CreateMsaDetailV2Dto';
import { UniqueNikConstraint } from '@helper/dto/dtoHelper';

export class CreateBulkMsaV2Dto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMsaDetailV2Dto)
  @Validate(UniqueNikConstraint, { message: 'Duplicate NIK is not allowed' })
  public msa!: CreateMsaDetailV2Dto[];
}
