import CreateMsaDetailDto from '@common/dto/msa/CreateMsaDetailDto';
import Msa from '@database/models/msa.model';
import MsaDetail, { MsaDetailAttributes } from '@database/models/msa_detail.model';

export interface IMsaDetailService {
  create(data: CreateMsaDetailDto, msaId: string): Promise<MsaDetail>;
  createMany(data: CreateMsaDetailDto[], msaId: number): Promise<MsaDetail[]>;
  getById(id: number): Promise<MsaDetail | null>;
  updateById(msaId: number, msaDetailId: number, data: CreateMsaDetailDto): Promise<MsaDetailAttributes>;
  totalPeople(msaDetails: MsaDetailAttributes[] | MsaDetail[]): number;
  totalBudgetUsed(msaDetails: MsaDetailAttributes[] | MsaDetail[]): number;
  checkQuotaLimits(msa: Msa, newMsaDetail: CreateMsaDetailDto | MsaDetail, isUpdate?: boolean): void;
  deleteById(id: number): Promise<void>;
  deleteMsaDetail(msaId: number, msaDetailId: number): Promise<void>;
}
