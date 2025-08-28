import { CreateBulkMsaV2Dto } from '@common/dto/v2/msaV2/CreateBulkMsaV2Dto';
import Database from '@config/db';
import { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { mapRolesToMsa, validateBudgetQuota, validateMsaJoinDates, validatePeopleQuota } from '@helper/function/v2';
import { ensureUniqueNIK, ensureUniqueProjects } from '@helper/function/v2/commonv2';
import { ResponseApi } from '@helper/interface/response.interface';
import { msaV2resource } from '@resource/v2/pks-msa/msa.resource';
import { PksMsaV2Service } from '@service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '@service/v2/msa/msaDetailV2.service';
import { MsaProjectV2Service } from '@service/v2/msa/msaProjectV2.service';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import _ from 'lodash';
import { DateTime } from 'luxon';

export class MsaDetailV2Controller {
  private pksMsaService = new PksMsaV2Service();
  private msaService = new MsaV2Service();
  private msaProjectService = new MsaProjectV2Service();

  async create(
    req: Request<any, any, CreateBulkMsaV2Dto>,
    res: Response<ResponseApi<V2MsaAttributes[]>>
  ): Promise<void> {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;
      if (!isStringNumber(id)) throw new BadRequestException('Invalid PKS MSA ID format');

      const { msa } = req.body;
      const msaId = parseInt(id);

      // Reset data lama & ambil pks info
      await this.msaService.deleteByMsaId(msaId, transaction);
      const pks = await this.pksMsaService.getById(msaId, transaction);

      const { budgetQuota, dateStarted, dateEnded, peopleQuota, roles = [] } = pks;

      // Validasi umum
      const startDate = DateTime.fromJSDate(dateStarted).toISO()!;
      const endDate = DateTime.fromJSDate(dateEnded).toISO()!;
      validateMsaJoinDates(msa, startDate, endDate);
      validatePeopleQuota(msa.length, peopleQuota);

      const mappedRoles = mapRolesToMsa(msa, roles);
      validateBudgetQuota(msa, mappedRoles, endDate, budgetQuota);

      // Simpan data
      const msas = await Promise.all(
        msa.map(async (_msa) => {
          await ensureUniqueNIK(this.msaService, msaId, _msa.nik, transaction);
          const _result = await this.msaService.create(msaId, _msa, transaction);

          if (_msa.projects?.length) {
            ensureUniqueProjects(_msa.projects);
            await Promise.all(
              _msa.projects.map((project) => this.msaProjectService.create(_result.id, project, transaction))
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
