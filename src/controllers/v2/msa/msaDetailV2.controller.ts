import { CreateBulkMsaV2Dto } from '@common/dto/v2/msaV2/CreateBulkMsaV2Dto';
import Database from '@config/db';
import { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { mapRolesToMsa, validateBudgetQuota, validateMsaJoinDates, validatePeopleQuota } from '@helper/function/v2';
import { ResponseApi } from '@helper/interface/response.interface';
import { msaV2resource } from '@resource/v2/pks-msa/msa.resource';
import { PksMsaV2Service } from '@service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '@service/v2/msa/msaDetailV2.service';
import { MsaProjectV2Service } from '@service/v2/msa/msaProjectV2.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;
  private msaProjectService: MsaProjectV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
    this.msaProjectService = new MsaProjectV2Service();
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
      validateMsaJoinDates(msa, DateTime.fromJSDate(dateStarted).toISO()!, DateTime.fromJSDate(dateEnded).toISO()!);
      validatePeopleQuota(msa.length, peopleQuota);
      const mappedRoles = mapRolesToMsa(msa, roles);
      validateBudgetQuota(msa, mappedRoles, DateTime.fromJSDate(dateEnded).toISO()!, budgetQuota);

      const msas = await Promise.all(
        msa.map(async (_msa) => {
          const msaCheck = await this.msaService.getWhere({ nik: _msa.nik, isActive: true }, transaction);
          if (msaCheck) {
            if (msaCheck.pksMsaId !== msaId) {
              throw new BadRequestException('NIK already exist and active');
            }
          }
          const _result = await this.msaService.create(msaId, _msa, transaction);

          if (_msa.projects && _msa.projects.length > 0) {
            await Promise.all(
              _msa.projects.map((project) => {
                return this.msaProjectService.create(_result.id, project, transaction);
              })
            );
          }

          return _result; 
        })
      );

      const results = await this.msaService.getByPksId(msaId, transaction);
      await transaction.commit();
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Success',
        data: results.map((result) => msaV2resource(result)),
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}
