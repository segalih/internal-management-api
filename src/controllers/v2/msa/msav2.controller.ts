import { CreateMsaV2Dto } from '@common/dto/v2/msaV2/createMsaV2Dto';
import Database from '@config/db';
import { SearchCondition } from '@database/models/base.model';
import { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { ResponseApi, ResponseApiWithPagination } from '@helper/interface/response.interface';
import { OtherSearchConditions, PksMsaV2Service } from '@service/v2/msa/PksMsaV2.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

export class MsaV2Controller {
  private pksMsaService: PksMsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
  }
  async create(req: Request<any, any, CreateMsaV2Dto>, res: Response<ResponseApi<V2PksMsaAttributes>>) {
    const transaction = await Database.database.transaction();
    try {
      if (!req.body.roles || req.body.roles.length === 0) {
        throw new BadRequestException('At least one role is required');
      }

      const _dateStarted = DateTime.fromISO(req.body.date_started, { zone: 'UTC' });
      const _dateEnded = DateTime.fromISO(req.body.date_ended, { zone: 'UTC' });

      if (_dateStarted > _dateEnded) {
        throw new BadRequestException('Date started must be before date ended');
      }

      const pksMsa = await this.pksMsaService.create(req.body, transaction);
      if (!pksMsa) {
        throw new BadRequestException('Failed to create MSA');
      }

      const result = await this.pksMsaService.getById(pksMsa.id, transaction);

      await transaction.commit();
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Msa created successfully',
        data: this.pksMsaService.pksMsaResponse(result),
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }
  async update(req: Request, res: Response<ResponseApi<void>>) {}

  async index(req: Request, res: Response<ResponseApiWithPagination<V2PksMsaAttributes>>) {
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
        name,
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
          keyValue: date_started_to ? DateTime.fromISO(date_started_to as string, { zone: 'UTC' }).toISO() : '',
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
          keyValue: date_ended_to ? DateTime.fromISO(date_ended_to as string, { zone: 'UTC' }).toISO() : '',
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

      const otherSearchConditions: OtherSearchConditions = {
        name: name as string,
      };

      const sortOptions = {
        key: (req.query.sort_by as string) || 'id',
        order: (req.query.sort_order as string) || 'DESC',
      };

      const results = await this.pksMsaService.getAll({
        page,
        perPage,
        searchConditions,
        sortOptions,
        otherSearchConditions,
      });

      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA list retrieved successfully',
        data: results.data.map((pksMsa) => this.pksMsaService.pksMsaResponse(pksMsa)),
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

      await this.pksMsaService.deleteById(parseInt(id, 10));
      res.status(HttpStatusCode.NoContent).json(void 0);
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async show(req: Request, res: Response<ResponseApi<V2PksMsaAttributes>>) {
    try {
      const id = req.params.id;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid MSA ID');
      }

      const result = await this.pksMsaService.getById(parseInt(id, 10));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'MSA retrieved successfully',
        data: this.pksMsaService.pksMsaResponse(result),
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
