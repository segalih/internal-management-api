import { Request, Response } from 'express';
import MsaService from '../../service/msa/msa.service';
import { ResponseApi } from '../../helper/interface/response.interface';
import { MsaAttributes } from '../../database/models/msa.model';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import { isStringNumber } from '../../helper/function/common';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import * as fs from 'fs';

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

      const filePath = `./uploads/${msa.bast}`;

      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      res.download(filePath, msa.bast);
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
