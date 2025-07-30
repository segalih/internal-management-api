import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export default class MsaService {
  constructor() {}

  async createMsa(data: CreateMsaDto, file: Express.Multer.File): Promise<MsaAttributes> {
    console.log('Creating MSA with data:', data, 'and file:', file);
    const filename = file.filename;
    const msa = await Msa.create({
      pks: data.pks,
      bast: filename,
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

  async getById(id: number): Promise<MsaAttributes> {
    const msa = await Msa.findByPk(id);
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }
    return msa.toJSON();
  }
}
