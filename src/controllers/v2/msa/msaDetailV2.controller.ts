import { Request, Response } from 'express';
import { V2PksMsaAttributes } from '../../../database/models/v2/v2_pks_msa.model';
import { ResponseApi } from '../../../helper/interface/response.interface';
import { PksMsaV2Service } from '../../../service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '../../../service/v2/msa/msaDetailV2.service';
import Database from '../../../config/db';
import { ProcessError } from '../../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { getDiffMonths, isStringNumber, rupiahFormatter } from '../../../helper/function/common';
import { BadRequestException } from '../../../helper/Error/BadRequestException/BadRequestException';
import { CreateBulkMsaV2Dto } from '../../../common/dto/v2/msaV2/CreateBulkMsaV2Dto';
import V2Msa from '../../../database/models/v2/v2_msa.model';
import { DateTime } from 'luxon';
import V2MsaHasRoles from '../../../database/models/v2/v2_msa_has_roles.model';
export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }

  async create(req: Request, res: Response<ResponseApi<V2PksMsaAttributes>>): Promise<void> {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;
      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid PKS MSA ID format');
      }

      const { msa }: CreateBulkMsaV2Dto = req.body;

      const pks = await this.pksMsaService.getById(parseInt(id));
      const { budgetQuota, dateStarted, dateEnded } = pks;

      const totalOfMonthsContract = getDiffMonths(dateStarted, dateEnded);

      const curentBudgetList = pks.msas?.map((item) => item.role?.rate || 0) || [];
      const totalBudget = curentBudgetList.reduce((acc, cur) => acc + (cur || 0), 0);

      const mapRolesByNewRoleId = msa.map((item) => {
        const role = pks.roles?.find((role) => role.id === item.role_id);
        if (!role) {
          throw new BadRequestException(`Role with ID ${item.role_id} not found in PKS MSA`);
        }
        return role;
      });

      const totalBudgetByNewRole = mapRolesByNewRoleId.reduce((acc, cur) => acc + (cur.rate || 0), 0);
      console.log('Total Budget By New Role:', totalBudgetByNewRole);
      const totalBudgetMonthly = totalBudget + totalBudgetByNewRole;

      const totalBudgetByContract = totalBudgetMonthly * totalOfMonthsContract;
      console.log('Total Budget By Contract:', totalBudgetByContract);
      console.log('Budget Quota:', budgetQuota);
      if (totalBudgetByContract > budgetQuota) {
        throw new BadRequestException(
          `Total budget for the contract exceeds the budget quota. Total: ${rupiahFormatter(
            totalBudgetByContract
          )}, Quota: ${rupiahFormatter(budgetQuota)}`
        );
      }

      await Promise.all(msa.map((_msa) => this.msaService.create(parseInt(id), _msa)));

      await transaction.commit();
      res.status(HttpStatusCode.Created).json(req.body);
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}
