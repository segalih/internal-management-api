import { Request, Response } from 'express';
import MsaService from '../../service/msa/msa.service';
import { ResponseApi } from '../../helper/interface/response.interface';
import { MsaAttributes } from '../../database/models/msa.model';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';

export class MsaController {
  private msaService: MsaService; // Replace with actual service type

  constructor() {
    this.msaService = new MsaService(); // Initialize with actual service instance
  }

  async create(req: Request, res: Response<ResponseApi<MsaAttributes>>) {
    try {
      const result = await this.msaService.createMsa(req.body, req.file! as Express.Multer.File);
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

  async getFile(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const msa = await this.msaService.getById(id);
      if (!msa) {
        return res.status(HttpStatusCode.NotFound).json({
          statusCode: HttpStatusCode.NotFound,
          message: 'MSA not found',
          data: null,
        });
      }
      const filePath = `./uploads/${msa.bast}`;
      res.download(filePath, msa.bast);
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
