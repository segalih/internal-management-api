// src/services/msa/type/interface.ts

import CreateMsaDto from '@common/dto/msa/CreateMsaDto';
import { PaginationResult, SearchCondition, sortOptions } from '@database/models/base.model';
import { MsaAttributes } from '@database/models/msa.model';
import Msa from '@database/models/msa.model';

export interface IMsaService {
  create(data: CreateMsaDto): Promise<Msa>;
  updateById(id: number, data: CreateMsaDto, filePksId?: number, fileBastId?: number): Promise<Msa>;
  getById(id: number): Promise<Msa>;
  MsaResponse(msa: Msa): MsaAttributes;
  deleteById(id: number): Promise<void>;
  getAll(input: {
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: sortOptions;
  }): Promise<PaginationResult<MsaAttributes>>;
  renameDocumentType(fileName: string, id: number, type: string, name: string): string;
}
