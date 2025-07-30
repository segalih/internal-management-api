import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import MsaDetail from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import MsaDetailService from './msaDetail.service';

export default class MsaService {
  private msaDetailService: MsaDetailService;
  constructor() {
    this.msaDetailService = new MsaDetailService();
  }

  async create(data: CreateMsaDto, file: Express.Multer.File): Promise<MsaAttributes> {
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
    return await this.getById(msa.id);
  }

  async updateById(id: number, data: CreateMsaDto, file?: Express.Multer.File): Promise<MsaAttributes> {
    const msa = await Msa.findByPk(id, {
      include: [
        {
          model: MsaDetail,
          as: 'details',
        },
      ],
    });
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    if (!msa.details) {
      msa.details = [];
    }
    if (file) {
      const filename = file.filename;
      data.bast = filename;
    }

    const totalPeople = this.msaDetailService.totalPeople(msa.details);
    const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msa.details);
    const newBudgetQuota = parseFloat(data.budget_quota.toString());

    if (totalPeople > data.people_quota) {
      throw new NotFoundException('Maximum number of people exceeded');
    }

    if (totalBudgetUsed > newBudgetQuota) {
      throw new UnprocessableEntityException('Maximum budget exceeded', {
        newBudgetQuota: newBudgetQuota,
        totalBudgetUsed: totalBudgetUsed,
      });
    }

    await msa.update({
      pks: data.pks,
      bast: data.bast,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: data.people_quota,
      budgetQuota: data.budget_quota,
    });

    if (!msa) {
      throw new NotFoundException('MSA not updated');
    }

    return await this.getById(msa.id);
  }

  async getById(id: number): Promise<MsaAttributes> {
    const msa = await Msa.findByPk(id);

    if (!msa) {
      throw new NotFoundException('MSA not found');
    }
    return { ...msa.toJSON(), fileUrl: `/api/msa/file/${msa.id}` };
  }
}
