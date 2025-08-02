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
import { encrypt } from '../../helper/function/crypto';
export default class MsaService {
  private msaDetailService: MsaDetailService;
  constructor() {
    this.msaDetailService = new MsaDetailService();
  }

  async create(data: CreateMsaDto): Promise<Msa> {
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

  async updateById(id: number, data: CreateMsaDto, filePksId?: number, fileBastId?: number): Promise<MsaAttributes> {
    const msa = await this.getById(id);

    if (!msa) {
      throw new NotFoundException('MSA not found');
    }

    if (!msa.details) {
      msa.details = [];
    }

    await msa.update({
      pks: data.pks,
      dateStarted: data.date_started,
      dateEnded: data.date_ended,
      peopleQuota: parseInt(data.people_quota, 10),
      budgetQuota: parseFloat(data.budget_quota.toString()),
      pksFileId: filePksId ? filePksId : msa.pksFileId,
      bastFileId: fileBastId ? fileBastId : msa.bastFileId,
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
    const pksFileIdBase64 = Buffer.from(msa.pksFileId?.toString() || '').toString('base64');
    const bastFileIdBase64 = Buffer.from(msa.bastFileId?.toString() || '').toString('base64');
    return {
      ...msa.toJSON(),
      pksFileUrl: `/api/document/${pksFileIdBase64}`,
      bastFileUrl: `/api/document/${bastFileIdBase64}`,
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
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: sortOptions;
  }): Promise<PaginationResult<MsaAttributes>> {
    const results = await Msa.paginate<MsaAttributes>({
      page: input.page,
      PerPage: input.perPage,
      searchConditions: input.searchConditions || [],
      sortOptions: input.sortOptions,
    });

    return results;
  }

  renameDocumentType(fileName: string, id: number, type: string, name: string): string {
    const ext = path.extname(fileName);
    const newFileName = `${Date.now()}-${id}-${type}-${name}${ext}`;
    return newFileName;
  }
}
