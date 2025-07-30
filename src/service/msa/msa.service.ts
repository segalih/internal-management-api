import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export default class MsaService {
  constructor() {}

  async createMsa(data: CreateMsaDto): Promise<MsaAttributes> {
    const msa = await Msa.create({
      pks: data.pks,
      bast: data.bast,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: data.people_quota,
      budgetQuota: data.budget_quota,
    });
    if (!msa) {
      throw new NotFoundException('MSA not created');
    }
    return msa.toJSON();
  }
}
