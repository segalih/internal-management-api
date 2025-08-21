import { CreateBulkMsaV2Dto } from '@common/dto/v2/msaV2/CreateBulkMsaV2Dto';
import Database from '@config/db';
import { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { mapRolesToMsa, validateBudgetQuota, validateMsaJoinDates, validatePeopleQuota } from '@helper/function/v2';
import { ResponseApi } from '@helper/interface/response.interface';
import { PksMsaV2Service } from '@service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '@service/v2/msa/msaDetailV2.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }

  async create(
    req: Request<any, any, CreateBulkMsaV2Dto>,
    res: Response<ResponseApi<V2MsaAttributes[]>>
  ): Promise<void> {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;
      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid PKS MSA ID format');
      }

      const { msa } = req.body;
      const msaId = parseInt(id);

      await this.msaService.deleteByMsaId(msaId, transaction);

      const pks = await this.pksMsaService.getById(msaId, transaction);
      const { budgetQuota, dateStarted, dateEnded, peopleQuota, roles = [] } = pks;

      validateMsaJoinDates(msa, dateStarted, dateEnded);
      validatePeopleQuota(msa.length, peopleQuota);
      const mappedRoles = mapRolesToMsa(msa, roles);
      validateBudgetQuota(msa, mappedRoles, dateEnded, budgetQuota);

      await Promise.all(msa.map((_msa) => this.msaService.create(msaId, _msa, transaction)));
      const result = await this.msaService.getByPksId(msaId);

      await transaction.commit();
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Success',
        data: result,
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}
