import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { MsaDetailAttributes } from '../../database/models/msa_detail.model';
import { ProcessError } from '../../helper/Error/errorHandler';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { isStringNumber } from '../../helper/function/common';
import { ResponseApi } from '../../helper/interface/response.interface';
import MsaDetailService from '../../service/msa/msaDetail.service';

export class MsaDetailController {
  private msaDetailService: MsaDetailService;

  constructor() {
    this.msaDetailService = new MsaDetailService();
  }

  async create(req: Request, res: Response<ResponseApi<MsaDetailAttributes>>): Promise<void> {
    try {
      const msaId = req.params.id;
      if (!isStringNumber(msaId)) {
        throw new UnprocessableEntityException('Invalid MSA ID format', { msaId });
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
