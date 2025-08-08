import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { MsaDetailAttributes } from '@database/models/msa_detail.model';
import { ProcessError } from '@helper/Error/errorHandler';
import { UnprocessableEntityException } from '@helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { isStringNumber, rupiahFormatter } from '@helper/function/common';
import { ResponseApi } from '@helper/interface/response.interface';
import MsaDetailService from '@service/msa/msaDetail.service';
import MsaService from '@service/msa/msa.service';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { DateTime } from 'luxon';

export class MsaDetailController {
  private msaDetailService: MsaDetailService;
  private msaService: MsaService;

  constructor() {
    this.msaDetailService = new MsaDetailService();
    this.msaService = new MsaService();
  }

  async create(req: Request, res: Response<ResponseApi<MsaDetailAttributes>>): Promise<void> {
    try {
      const msaId = req.params.id;
      if (!isStringNumber(msaId)) {
        throw new UnprocessableEntityException('Invalid MSA ID format', { msaId });
      }
      const msa = await this.msaService.getById(parseInt(msaId, 10));
      if (!msa) {
        throw new NotFoundException('MSA not found', { msaId });
      }

      const totalPeople = this.msaDetailService.totalPeople(msa.details ?? []) + 1;
      const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msa.details ?? []) + parseInt(req.body.rate, 10);

      if (totalPeople > msa.peopleQuota) {
        throw new BadRequestException(`Total people (${totalPeople}) exceeds the quota (${msa.peopleQuota})`);
      }

      const dateStarted = DateTime.fromISO(msa.dateStarted);
      const dateEnded = DateTime.fromISO(msa.dateEnded);

      const diffDate = dateEnded.diff(dateStarted, 'months');

      const totalBudgetAllContract = Math.ceil(diffDate.months) * totalBudgetUsed;
      if (totalBudgetAllContract > msa.budgetQuota) {
        throw new BadRequestException(
          `Total budget used (${rupiahFormatter(totalBudgetAllContract)}) exceeds the quota (${rupiahFormatter(
            msa.budgetQuota
          )})`
        );
      }

      const msaDetail = await this.msaDetailService.create(req.body, msaId);
      const response: ResponseApi<typeof msaDetail> = {
        statusCode: 201,
        message: 'MSA detail created successfully',
        data: msaDetail,
      };
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<MsaDetailAttributes>>): Promise<void> {
    try {
      const msaId = req.params.id;
      const msaDetailId = req.params.msaDetailId;

      if (!isStringNumber(msaId) || !isStringNumber(msaDetailId)) {
        throw new UnprocessableEntityException('Invalid MSA or MSA detail ID format', {
          msaId,
          msaDetailId,
        });
      }

      const msa = await this.msaService.getById(parseInt(msaId, 10));

      if (!msa) {
        throw new NotFoundException('MSA not found', { msaId });
      }

      const dateStarted = DateTime.fromISO(msa.dateStarted);
      const dateEnded = DateTime.fromISO(msa.dateEnded);

      const diffDate = dateEnded.diff(dateStarted, 'months');

      const totalBudgetUsed = this.msaDetailService.totalBudgetUsed(msa.details ?? []);
      const currentMsa = msa.details?.find((detail) => detail.id === parseInt(msaDetailId, 10));
      const budgetWithoutCurrent = totalBudgetUsed - (currentMsa ? parseInt(currentMsa.rate, 10) : 0);
      const newTotalBudget = (totalBudgetUsed - budgetWithoutCurrent + parseInt(req.body.rate, 10)) * diffDate.months;

      if (newTotalBudget > msa.budgetQuota) {
        throw new BadRequestException(
          `Total budget used (${rupiahFormatter(newTotalBudget)}) exceeds the quota (${rupiahFormatter(
            msa.budgetQuota
          )})`
        );
      }

      const msaDetail = await this.msaDetailService.updateById(
        parseInt(msaId, 10),
        parseInt(msaDetailId, 10),
        req.body
      );
      const response: ResponseApi<typeof msaDetail> = {
        statusCode: 200,
        message: 'MSA detail updated successfully',
        data: msaDetail,
      };
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {
    try {
      const msaDetailId = req.params.msaDetailId;
      const msaId = req.params.id;
      if (!isStringNumber(msaDetailId) || !isStringNumber(msaId)) {
        throw new UnprocessableEntityException('Invalid MSA or MSA detail ID format', {
          msaDetailId,
          msaId,
        });
      }
      await this.msaDetailService.deleteMsaDetail(parseInt(msaDetailId, 10), parseInt(msaId, 10));
      res.status(HttpStatusCode.NoContent).json({
        statusCode: HttpStatusCode.NoContent,
        message: 'MSA detail deleted successfully',
        data: null,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
