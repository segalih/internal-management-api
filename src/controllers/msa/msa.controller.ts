import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { PaginationResult, SearchCondition } from '../../database/models/base.model';
import { MsaAttributes } from '../../database/models/msa.model';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '../../helper/Error/errorHandler';
import { isStringNumber } from '../../helper/function/common';
import { ResponseApi } from '../../helper/interface/response.interface';
import MsaService from '../../service/msa/msa.service';

export class MsaController {
  private msaService: MsaService;

  constructor() {
    this.msaService = new MsaService();
  }

  async create(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      if (!req.file) {
        throw new BadRequestException('File is required');
      }

      const result = await this.msaService.create(req.body, req.file! as Express.Multer.File);
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'MSA created successfully',
        data: result,
      });
    } catch (err) {
      const fs = require('fs');
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      ProcessError(err, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      const id = req.params.id;

      const bastFile = req.file ? req.file : undefined;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid MSA ID');
      }

      const msaId = parseInt(id, 10);

      const result = await this.msaService.updateById(msaId, req.body, bastFile);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA updated successfully',
        data: result,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async getFile(req: Request, res: Response) {
    try {
      const msaId = req.params.id;

      if (!isStringNumber(msaId)) {
        throw new BadRequestException('Invalid MSA ID');
      }

      await this.msaService.getById(parseInt(msaId, 10));

      const msa = await this.msaService.getById(parseInt(msaId, 10));

      const filePath = `./uploads/pks_msa/${msaId}/${msa.bast}`;

      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      res.download(filePath, msa.bast);
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async index(req: Request, res: Response<ResponseApi<PaginationResult<MsaAttributes>>>) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = parseInt(req.query.offset as string, 10) || 1;

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
          keyValue: date_started_to
            ? DateTime.fromISO(date_started_to as string)
                .plus({ days: 1 })
                .toISO()
            : '',
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
        limit,
        offset,
        searchConditions,
        sortOptions,
      });

      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA list retrieved successfully',
        data: results,
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
