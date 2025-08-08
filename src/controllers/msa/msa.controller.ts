import CreateMsaDto from '@common/dto/msa/CreateMsaDto';
import { SearchCondition } from '@database/models/base.model';
import { MSA_CONSTANTS, MsaAttributes } from '@database/models/msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { ResponseApi, ResponseApiWithPagination } from '@helper/interface/response.interface';
import { DocumentService } from '@service/document/document.service';
import MsaService from '@service/msa/msa.service';
import MsaDetailService from '@service/msa/msaDetail.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

export class MsaController {
  private msaService: MsaService;
  private msaDetailService: MsaDetailService;
  private documentService: DocumentService;

  constructor() {
    this.msaService = new MsaService();
    this.msaDetailService = new MsaDetailService();
    this.documentService = new DocumentService();
  }

  async create(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const payload = req.body as CreateMsaDto;

      const filePKS = files['file_pks']?.[0];
      const fileBAST = files['file_bast']?.[0];

      if (!filePKS || !fileBAST) {
        throw new BadRequestException('Both file_pks and file_bast are required');
      }

      const totalPeople = this.msaDetailService.totalPeople(req.body.details);
      const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(req.body.details);

      if (totalPeople > parseInt(req.body.people_quota, 10)) {
        throw new BadRequestException(`Total people (${totalPeople}) exceeds the quota (${req.body.people_quota})`);
      }

      const dateStarted = DateTime.fromISO(payload.date_started);
      const dateEnded = DateTime.fromISO(payload.date_ended);

      const diffDate = dateEnded.diff(dateStarted, 'months');
      const totalBudgetAllContract = Math.ceil(diffDate.months) * totalBudgetUsed;

      if (totalBudgetAllContract > parseInt(req.body.budget_quota, 10)) {
        throw new BadRequestException(
          `Total budget used (${totalBudgetAllContract}) exceeds the quota (${req.body.budget_quota})`
        );
      }

      const msa = await this.msaService.create(req.body);
      const pksFile = await this.documentService.saveDocument({
        file_type: 'file_msa_pks',
        filename: filePKS.filename,
        path: MSA_CONSTANTS.BASE_PATH + msa.id + '/' + filePKS.filename,
      });
      const bastFile = await this.documentService.saveDocument({
        file_type: 'file_msa_bast',
        filename: fileBAST.filename,
        path: MSA_CONSTANTS.BASE_PATH + msa.id + '/' + fileBAST.filename,
      });

      await msa.update({
        pksFileId: pksFile.id,
        bastFileId: bastFile.id,
      });

      if (req.body.details) {
        await this.msaDetailService.createMany(req.body.details, msa.id);
      }

      const result = await this.msaService.getById(msa.id);

      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'MSA created successfully',
        data: this.msaService.MsaResponse(result),
      });
    } catch (err) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      [files['file_pks']?.[0]?.path ?? '', files['file_bast']?.[0]?.path ?? ''].forEach((filePath) => {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      ProcessError(err, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      const id = req.params.id;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const payload = req.body as CreateMsaDto;

      const filePKS = files['file_pks']?.[0];
      const fileBAST = files['file_bast']?.[0];

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid Url');
      }

      const msaId = parseInt(id, 10);

      const msa = await this.msaService.getById(msaId);
      const msaDetails = msa.details ?? [];

      const totalPeople = this.msaDetailService.totalPeople(msaDetails);
      const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msaDetails);

      if (totalPeople > parseInt(req.body.people_quota, 10)) {
        throw new BadRequestException(`Total people (${totalPeople}) exceeds the quota (${req.body.people_quota})`);
      }

      const dateStarted = DateTime.fromISO(payload.date_started);
      const dateEnded = DateTime.fromISO(payload.date_ended);

      const diffDate = dateEnded.diff(dateStarted, 'months');
      const totalBudgetAllContract = Math.ceil(diffDate.months) * totalBudgetUsed;

      if (totalBudgetAllContract > parseInt(req.body.budget_quota, 10)) {
        throw new BadRequestException(
          `Total budget used (${totalBudgetAllContract}) exceeds the quota (${req.body.budget_quota})`
        );
      }
      let filePksId: number | undefined;
      let fileBastId: number | undefined;
      if (filePKS) {
        const pksFile = await this.documentService.saveDocument({
          file_type: 'file_msa_pks',
          filename: filePKS.filename,
          path: MSA_CONSTANTS.BASE_PATH + msa.id + '/' + filePKS.filename,
        });
        filePksId = pksFile.id;
      }

      if (fileBAST) {
        const bastFile = await this.documentService.saveDocument({
          file_type: 'file_msa_bast',
          filename: fileBAST.filename,
          path: MSA_CONSTANTS.BASE_PATH + msa.id + '/' + fileBAST.filename,
        });
        fileBastId = bastFile.id;
      }

      const result = await this.msaService.updateById(msaId, req.body, filePksId, fileBastId);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA updated successfully',
        data: this.msaService.MsaResponse(result),
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async index(req: Request, res: Response<ResponseApiWithPagination<MsaAttributes>>) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const perPage = parseInt(req.query.per_page as string, 10) || 10;

      const {
        pks,
        date_started_from,
        date_started_to,
        date_ended_from,
        date_ended_to,
        people_quota,
        budget_quota,
        budget_quota_from,
        budget_quota_to,
      } = req.query;

      const searchConditions: SearchCondition[] = [
        {
          keySearch: 'pks',
          operator: Op.like,
          keyValue: pks ? `%${pks as string}%` : '',
          keyColumn: 'pks',
        },
        {
          keySearch: 'dateStarted',
          operator: Op.gte,
          keyValue: date_started_from ?? '',
          keyColumn: 'dateStarted',
        },
        {
          keySearch: 'dateStarted',
          operator: Op.lte,
          keyValue: date_started_to ? DateTime.fromISO(date_started_to as string).toISO() : '',
          keyColumn: 'dateStarted',
        },
        {
          keySearch: 'dateEnded',
          operator: Op.gte,
          keyValue: date_ended_from ? date_ended_from : '',
          keyColumn: 'dateEnded',
        },
        {
          keySearch: 'dateEnded',
          operator: Op.lte,
          keyValue: date_ended_to
            ? DateTime.fromISO(date_ended_to as string)
                .plus({ days: 1 })
                .toISO()
            : '',
          keyColumn: 'dateEnded',
        },
        {
          keySearch: 'peopleQuota',
          operator: Op.eq,
          keyValue: people_quota ? parseInt(people_quota as string, 10) : '',
          keyColumn: 'peopleQuota',
        },
        {
          keySearch: 'budgetQuota',
          operator: Op.eq,
          keyValue: budget_quota ? parseFloat(budget_quota as string) : '',
          keyColumn: 'budgetQuota',
        },
        {
          keySearch: 'budgetQuota',
          operator: Op.lte,
          keyValue: budget_quota_to ?? '',
          keyColumn: 'budgetQuota',
        },
        {
          keySearch: 'budgetQuota',
          operator: Op.gte,
          keyValue: budget_quota_from ?? '',
          keyColumn: 'budgetQuota',
        },
      ];

      const sortOptions = {
        key: (req.query.sort_by as string) || 'id',
        order: (req.query.sort_order as string) || 'DESC',
      };

      const results = await this.msaService.getAll({
        page,
        perPage,
        searchConditions,
        sortOptions,
      });

      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA list retrieved successfully',
        data: results.data,
        meta: {
          currentPage: results.currentPage,
          pageSize: results.pageSize,
          totalCount: results.totalCount,
          totalPages: results.totalPages,
        },
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async destroy(req: Request, res: Response<ResponseApi<void>>) {
    try {
      const id = req.params.id;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid MSA ID');
      }

      await this.msaService.deleteById(parseInt(id, 10));
      res.status(HttpStatusCode.NoContent).json(void 0);
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async show(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      const id = req.params.id;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid MSA ID');
      }

      const result = await this.msaService.getById(parseInt(id, 10));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA retrieved successfully',
        data: result,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
