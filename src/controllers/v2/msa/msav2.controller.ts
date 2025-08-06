import { Request, Response } from 'express';
import { ResponseApi, ResponseApiWithPagination } from '../../../helper/interface/response.interface';
import { PksMsaV2Service } from '../../../service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '../../../service/v2/msa/msaDetailV2.service';
import Database from '../../../../src/config/db';
import { BadRequestException } from '../../../helper/Error/BadRequestException/BadRequestException';
import { HttpStatusCode } from 'axios';
import { V2PksMsaAttributes } from '../../../database/models/v2/v2_pks_msa.model';
import { ProcessError } from '../../../helper/Error/errorHandler';

export class MsaV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }
  async create(req: Request, res: Response<ResponseApi<V2PksMsaAttributes>>) {
    const transaction = await Database.database.transaction();
    try {
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

  async index(req: Request, res: Response<ResponseApiWithPagination<void>>) {}

  async destroy(req: Request, res: Response<ResponseApi<void>>) {}

  async show(req: Request, res: Response<ResponseApi<void>>) {}
}
