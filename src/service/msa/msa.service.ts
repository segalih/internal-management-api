import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import { PaginationResult, SearchCondition, sortOptions } from '../../database/models/base.model';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import MsaDetail from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import MsaDetailService from './msaDetail.service';
import * as fs from 'fs';
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
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
    });

    if (!msa) {
      throw new NotFoundException('MSA not created');
    }
    await this.moveBastFile(msa.id);
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
    } else {
      data.bast = msa.bast;
    }

    const totalPeople = this.msaDetailService.totalPeople(msa.details);
    const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msa.details);
    const newBudgetQuota = parseFloat(data.budget_quota.toString());

    if (totalPeople > parseInt(data.people_quota, 10)) {
      throw new UnprocessableEntityException('Maximum number of people exceeded', {
        newPeopleQuota: parseInt(data.people_quota, 10),
        totalPeopleUsed: totalPeople,
      });
    }

    if (totalBudgetUsed > newBudgetQuota) {
      throw new UnprocessableEntityException('Maximum budget exceeded', {
        newBudgetQuota: newBudgetQuota,
        totalBudgetUsed: totalBudgetUsed,
      });
    }
    const oldBast = msa.bast;
    await msa.update({
      pks: data.pks,
      bast: data.bast,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
    });

    if (file && oldBast !== data.bast) {
        await this.moveBastFile(msa.id);
    }

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

  async deleteById(id: number): Promise<void> {
    const msa = await Msa.findByPk(id);
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }
    await msa.destroy();
  }

  async getAll(input: {
    limit: number;
    offset: number;
    searchConditions?: SearchCondition[];
    sortOptions?: sortOptions;
  }): Promise<PaginationResult<MsaAttributes>> {
    const results = await Msa.paginate<MsaAttributes>({
      offset: input.offset,
      limit: input.limit,
      searchConditions: input.searchConditions || [],
      sortOptions: input.sortOptions,
    });

    return results;
  }

  async moveBastFile(id: number): Promise<void> {
    const msa = await Msa.findByPk(id);
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    const oldPath = `./uploads/${msa.bast}`;
    const newFilePath = `./uploads/pks_msa/${id}/${msa.bast}`;

    if (!fs.existsSync(oldPath)) {
      throw new NotFoundException('File not found');
    }
    if (!fs.existsSync(`./uploads/pks_msa/${id}`)) {
      fs.mkdirSync(`./uploads/pks_msa/${id}`, { recursive: true });
    }
    if (oldPath === newFilePath) {
      return; // No need to move if the paths are the same
    }

    try {
      fs.renameSync(oldPath, newFilePath);
    } catch (err) {
      throw new Error('Gagal memindahkan file');
    }
  }
}
