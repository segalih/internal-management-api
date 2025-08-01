import fs from 'fs';
import path from 'path';
import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import { PaginationResult, SearchCondition, sortOptions } from '../../database/models/base.model';
import Msa, { MsaAttributes } from '../../database/models/msa.model';
import MsaDetail from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import MsaDetailService from './msaDetail.service';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import Document from '../../database/models/document.model';
export default class MsaService {
  private msaDetailService: MsaDetailService;
  constructor() {
    this.msaDetailService = new MsaDetailService();
  }

  async create(data: CreateMsaDto, file_pks: Express.Multer.File, file_bast: Express.Multer.File): Promise<Msa> {
    const msa = await Msa.create({
      pks: data.pks,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
    });

    if (!msa) {
      throw new NotFoundException('MSA not created');
    }

    return await this.getById(msa.id);
  }

  async updateById(
    id: number,
    data: CreateMsaDto,
    file_pks?: Express.Multer.File,
    file_bast?: Express.Multer.File
  ): Promise<MsaAttributes> {
    const msa = await Msa.findByPk(id, {
      include: [
        {
          model: MsaDetail,
          as: 'details',
        },
        { model: Document, as: 'pksFile' },
        { model: Document, as: 'bastFile' },
      ],
    });
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    if (!msa.details) {
      msa.details = [];
    }

    if (file_pks) {
      data.file_pks = file_pks.filename;
    }
    if (file_bast) {
      data.file_bast = file_bast.filename;
    }

    await msa.update({
      pks: data.pks,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
    });

    if (!msa) {
      throw new NotFoundException('MSA not updated');
    }

    return await this.getById(msa.id);
  }

  async getById(id: number): Promise<Msa> {
    const msa = await Msa.findByPk(id, {
      include: [
        {
          model: MsaDetail,
          as: 'details',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        {
          model: Document,
          as: 'pksFile',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'filename', 'path'],
          },
        },
        {
          model: Document,
          as: 'bastFile',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'filename', 'path'],
          },
        },
      ],
      attributes: {
        exclude: ['file_pks', 'file_bast', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    return msa;
  }

  MsaResponse(msa: Msa): MsaAttributes {
    return {
      ...msa.toJSON(),
      pksFileUrl: `/api/document/${msa.pksFileId}`,
      bastFileUrl: `/api/document/${msa.bastFileId}`,
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

  // async movePksMsaFiles(id: number): Promise<void> {
  //   const msa = await Msa.findByPk(id);
  //   if (!msa) {
  //     throw new NotFoundException('MSA not found');
  //   }

  //   const oldPats = [`./uploads/${msa.file_pks}`, `./uploads/${msa.file_bast}`];
  //   const newFileNames = {
  //     pks: this.renameDocumentType(msa.file_pks, msa.id, 'PKS', msa.pks),
  //     bast: this.renameDocumentType(msa.file_bast, msa.id, 'BAST', msa.pks),
  //   };
  //   const newFilePaths = [
  //     `./uploads/pks_msa/${id}/${newFileNames.pks}`,
  //     `./uploads/pks_msa/${id}/${newFileNames.bast}`,
  //   ];

  //   oldPats.forEach((oldPath, index) => {
  //     if (fs.existsSync(oldPath)) {
  //       if (!fs.existsSync(`./uploads/pks_msa/${id}`)) {
  //         fs.mkdirSync(`./uploads/pks_msa/${id}`, { recursive: true });
  //       }
  //       const newFilePath = newFilePaths[index];
  //       if (oldPath === newFilePath) {
  //         return;
  //       }

  //       try {
  //         fs.renameSync(oldPath, newFilePath);
  //       } catch (err) {
  //         throw new Error('Failed to move file');
  //       }
  //     }
  //   });

  //   await msa.update({
  //     file_pks: newFileNames.pks,
  //     file_bast: newFileNames.bast,
  //   });
  // }

  renameDocumentType(fileName: string, id: number, type: string, name: string): string {
    const ext = path.extname(fileName);
    const newFileName = `${Date.now()}-${id}-${type}-${name}${ext}`;
    return newFileName;
  }
}
