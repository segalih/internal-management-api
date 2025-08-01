import fs from 'fs';
import path from 'path';
import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import { PaginationResult, SearchCondition, sortOptions } from '../../database/models/base.model';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import MsaDetail from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import MsaDetailService from './msaDetail.service';
export default class MsaService {
  private msaDetailService: MsaDetailService;
  constructor() {
    this.msaDetailService = new MsaDetailService();
  }

  async create(
    data: CreateMsaDto,
    file_pks: Express.Multer.File,
    file_bast: Express.Multer.File
  ): Promise<MsaAttributes> {
    const msa = await Msa.create({
      pks: data.pks,
      file_pks: file_pks.filename,
      file_bast: file_bast.filename,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
    });

    if (!msa) {
      throw new NotFoundException('MSA not created');
    }
    await this.movePksMsaFiles(msa.id);

    if (data.details) {
      await this.msaDetailService.createMany(data.details, msa.id);
    }

    return await this.getById(msa.id);
  }

  // async updateById(id: number, data: CreateMsaDto, file?: Express.Multer.File): Promise<MsaAttributes> {
  //   const msa = await Msa.findByPk(id, {
  //     include: [
  //       {
  //         model: MsaDetail,
  //         as: 'details',
  //       },
  //     ],
  //   });
  //   if (!msa) {
  //     throw new NotFoundException('MSA not found');
  //   }

  //   if (!msa.details) {
  //     msa.details = [];
  //   }
  //   if (file) {
  //     const filename = file.filename;
  //     data.bast = filename;
  //   } else {
  //     data.bast = msa.bast;
  //   }

  //   const totalPeople = this.msaDetailService.totalPeople(msa.details);
  //   const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msa.details);
  //   const newBudgetQuota = parseFloat(data.budget_quota.toString());

  //   if (totalPeople > parseInt(data.people_quota, 10)) {
  //     throw new UnprocessableEntityException('Maximum number of people exceeded', {
  //       newPeopleQuota: parseInt(data.people_quota, 10),
  //       totalPeopleUsed: totalPeople,
  //     });
  //   }

  //   if (totalBudgetUsed > newBudgetQuota) {
  //     throw new UnprocessableEntityException('Maximum budget exceeded', {
  //       newBudgetQuota: newBudgetQuota,
  //       totalBudgetUsed: totalBudgetUsed,
  //     });
  //   }
  //   const oldBast = msa.file_bast;
  //   const oldPks = msa.file_pks;
  //   await msa.update({
  //     pks: data.pks,
  //     file_bast: data.file_bast,
  //     file_pks: data.file_pks,
  //     dateStarted: data.date_started,
  //     dateEnded: data.date_ended,
  //     peopleQuota: parseInt(data.people_quota, 10),
  //     budgetQuota: parseFloat(data.budget_quota.toString()),
  //   });

  //   if (file && oldBast !== data.bast) {
  //     await this.moveBastFile(msa.id);
  //   }

  //   if (!msa) {
  //     throw new NotFoundException('MSA not updated');
  //   }

  //   return await this.getById(msa.id);
  // }

  async getById(id: number): Promise<MsaAttributes> {
    const msa = await Msa.findByPk(id, {
      include: [
        {
          model: MsaDetail,
          as: 'details',
        },
      ],
      attributes: {
        exclude: ['file_pks', 'file_bast', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!msa) {
      throw new NotFoundException('MSA not found');
    }
    return {
      ...msa.toJSON(),
      pksFileUrl: `/api/msa/download-pks/${msa.id}`,
      bastFileUrl: `/api/msa/download-bast/${msa.id}`,
    };
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

  async movePksMsaFiles(id: number): Promise<void> {
    const msa = await Msa.findByPk(id);
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    const oldPats = [`./uploads/${msa.file_pks}`, `./uploads/${msa.file_bast}`];
    const newFileNames = {
      pks: this.renameDocumentType(msa.file_pks, msa.id, 'PKS', msa.pks),
      bast: this.renameDocumentType(msa.file_bast, msa.id, 'BAST', msa.pks),
    };
    const newFilePaths = [
      `./uploads/pks_msa/${id}/${newFileNames.pks}`,
      `./uploads/pks_msa/${id}/${newFileNames.bast}`,
    ];

    oldPats.forEach((oldPath, index) => {
      if (!fs.existsSync(oldPath)) {
        throw new NotFoundException('File not found');
      }
      if (!fs.existsSync(`./uploads/pks_msa/${id}`)) {
        fs.mkdirSync(`./uploads/pks_msa/${id}`, { recursive: true });
      }
      const newFilePath = newFilePaths[index];
      if (oldPath === newFilePath) {
        return;
      }

      try {
        fs.renameSync(oldPath, newFilePath);
      } catch (err) {
        throw new Error('Failed to move file');
      }
    });

    await msa.update({
      file_pks: newFileNames.pks,
      file_bast: newFileNames.bast,
    });
  }

  renameDocumentType(fileName: string, id: number, type: string, name: string): string {
    const ext = path.extname(fileName);
    const newFileName = `${Date.now()}-${id}-${type}-${name}${ext}`;
    return newFileName;
  }
}
