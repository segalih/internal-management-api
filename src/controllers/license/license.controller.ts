/// <reference path="../custom.d.ts" />
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { PaginationResult } from '../../database/models/base.model';
import { LicenseAttributes, LISENCE_CONSTANTS } from '../../database/models/license.model';
import { ProcessError } from '../../helper/Error/errorHandler';
import { ResponseApi } from '../../helper/interface/response.interface';
import LicenseService from '../../service/license/license.service';
import { DocumentService } from '../../service/document/document.service';
import { CreateLisenceDto } from '../../common/dto/lisence/CreateLisenceDto';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import fs from 'fs';
import { isStringNumber } from '../../helper/function/common';

export class LicenseController {
  private licenseService: LicenseService;
  private documentService: DocumentService;

  constructor() {
    this.licenseService = new LicenseService();
    this.documentService = new DocumentService();
  }

  async create(req: Request, res: Response<ResponseApi<LicenseAttributes>>) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const payload = req.body as CreateLisenceDto;

      const filePKS = files['file_pks']?.[0];
      const fileBAST = files['file_bast']?.[0];

      if (!filePKS || !fileBAST) {
        throw new BadRequestException('Both file_pks and file_bast are required');
      }
      const license = await this.licenseService.create(payload);

      const pksFile = await this.documentService.saveDocument({
        file_type: 'file_pks_lisence',
        filename: filePKS.filename,
        path: LISENCE_CONSTANTS.BASE_PATH + license.id + '/' + filePKS.filename,
      });

      const bastFile = await this.documentService.saveDocument({
        file_type: 'file_bast_lisence',
        filename: fileBAST.filename,
        path: LISENCE_CONSTANTS.BASE_PATH + license.id + '/' + fileBAST.filename,
      });

      await license.update({
        pksFileId: pksFile.id,
        bastFileId: bastFile.id,
      });
      res.status(HttpStatusCode.Created).json({
        message: 'License created successfully',
        statusCode: HttpStatusCode.Created,
        data: this.licenseService.licenseResponse(license),
      });
    } catch (err) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      [files['file_pks']?.[0].path ?? '', files['file_bast']?.[0].path ?? ''].forEach((filePath) => {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      ProcessError(err, res);
    }
  }

  async show(req: Request, res: Response<ResponseApi<LicenseAttributes>>) {
    try {
      const id = parseInt(req.params.id, 10);
      const license = await this.licenseService.getById(id);
      res.status(HttpStatusCode.Ok).json({
        message: 'License retrieved successfully',
        statusCode: HttpStatusCode.Ok,
        data: license,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async destroy(req: Request, res: Response<ResponseApi<null>>) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.licenseService.deleteById(id);
      res.status(204).json({
        message: 'License deleted successfully',
        statusCode: HttpStatusCode.NoContent,
        data: null,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async update(req: Request, res: Response<ResponseApi<LicenseAttributes>>) {
    try {
      const id = req.params.id;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const payload = req.body as CreateLisenceDto;

      const filePKS = files['file_pks']?.[0];
      const fileBAST = files['file_bast']?.[0];

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid Url');
      }

      const licenseId = parseInt(id, 10);

      const license = await this.licenseService.getById(licenseId);

      let filePksId: number | undefined;
      let fileBastId: number | undefined;
      if (filePKS) {
        const pksFile = await this.documentService.saveDocument({
          file_type: 'file_pks_lisence',
          filename: filePKS.filename,
          path: LISENCE_CONSTANTS.BASE_PATH + license.id + '/' + filePKS.filename,
        });
        filePksId = pksFile.id;
      }

      if (fileBAST) {
        const bastFile = await this.documentService.saveDocument({
          file_type: 'file_bast_lisence',
          filename: fileBAST.filename,
          path: LISENCE_CONSTANTS.BASE_PATH + license.id + '/' + fileBAST.filename,
        });
        fileBastId = bastFile.id;
      }

      const updatedLicense = await this.licenseService.updateById(licenseId, payload, filePksId, fileBastId);
      console.log('Updated License:', updatedLicense);
      res.status(HttpStatusCode.Ok).json({
        message: 'License updated successfully',
        statusCode: HttpStatusCode.Ok,
        data: this.licenseService.licenseResponse(updatedLicense),
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async index(req: Request, res: Response<ResponseApi<PaginationResult<LicenseAttributes>>>) {
    const { page, per_page, bast } = req.query;

    const licenses = await this.licenseService.getAll({
      perPage: parseInt((per_page as string) ?? '10', 10),
      page: parseInt((page as string) ?? '1', 10),
      searchConditions: [
        {
          keyValue: bast ?? '',
          operator: Op.eq,
          keyColumn: 'bast',
          keySearch: 'bast',
        },
      ],
    });

    res.status(HttpStatusCode.Ok).json({
      message: 'OK',
      statusCode: HttpStatusCode.Ok,
      data: licenses,
    });
  }
}
