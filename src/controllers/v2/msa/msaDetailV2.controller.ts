import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { CreateBulkMsaV2Dto } from '@common/dto/v2/msaV2/CreateBulkMsaV2Dto';
import Database from '@config/db';
import { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { getDiffMonths, isStringNumber, rupiahFormatter } from '@helper/function/common';
import { ResponseApi } from '@helper/interface/response.interface';
import { PksMsaV2Service } from '@service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '@service/v2/msa/msaDetailV2.service';
import { DateTime } from 'luxon';
export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }

  async create(
    req: Request<any, any, CreateBulkMsaV2Dto>,
    res: Response<ResponseApi<CreateBulkMsaV2Dto>>
  ): Promise<void> {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;
      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid PKS MSA ID format');
      }

      const { msa } = req.body;

      await this.msaService.deleteByMsaId(parseInt(id), transaction);

      const pks = await this.pksMsaService.getById(parseInt(id), transaction);

      const { budgetQuota, dateStarted, dateEnded } = pks;

      const _dateStarted = DateTime.fromISO(dateStarted);
      const _dateEnded = DateTime.fromISO(dateEnded);

      msa.forEach((item, index) => {
        const joinDate = DateTime.fromISO(item.join_date as string);
        if (joinDate < _dateStarted && joinDate > _dateEnded) {
          throw new BadRequestException(
            `Join date for msa ${index + 1} must be after date started and before date ended`,
            {}
          );
        }
      });

      const totalPeople = msa.length;

      if (totalPeople > pks.peopleQuota) {
        throw new BadRequestException(
          `Total people quota for the contract exceeds the budget quota. Total: ${totalPeople}, Quota: ${pks.peopleQuota}`
        );
      }
      const mapRolesByNewRoleId = msa.map((item) => {
        const role = pks.roles?.find((role) => role.id === item.role_id);
        if (!role) {
          throw new BadRequestException(`Role with ID ${item.role_id} not found in PKS MSA`);
        }
        return role;
      });

      const periodMsaUntilPksEnd = req.body.msa?.map((item) => getDiffMonths(item.join_date!, pks.dateEnded)) || [];
      const totalBudgetEachPerson = mapRolesByNewRoleId.map((role, index) => {
        return role.rate * periodMsaUntilPksEnd[index];
      });

      const totalBudgetMsas = totalBudgetEachPerson.reduce((acc, cur) => acc + (cur || 0), 0);

      console.log('totalBudgetEachPerson', totalBudgetEachPerson);
      console.log(totalBudgetMsas, budgetQuota);
      if (totalBudgetMsas > budgetQuota) {
        throw new BadRequestException(
          `Total budget for the contract exceeds the budget quota. Total: ${rupiahFormatter(
            totalBudgetMsas
          )}, Quota: ${rupiahFormatter(budgetQuota)}`
        );
      }

      await Promise.all(msa.map((_msa) => this.msaService.create(parseInt(id), _msa, transaction)));

      await transaction.commit();
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Success',
        data: req.body,
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}
