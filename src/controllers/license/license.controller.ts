/// <reference path="../custom.d.ts" />
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { PaginationResult } from '../../database/models/base.model';
import { LicenseAttributes } from '../../database/models/license.model';
import { ProcessError } from '../../helper/Error/errorHandler';
import { ResponseApi } from '../../helper/interface/response.interface';
import LicenseService from '../../service/license/license.service';

export class LicenseController {
  private licenseService: LicenseService; // Replace with actual service type

  constructor() {
    this.licenseService = new LicenseService(); // Initialize with actual service instance
  }

  async create(req: Request, res: Response<ResponseApi<LicenseAttributes>>) {
    try {
      const result = await this.licenseService.create(req.body);
      res.status(HttpStatusCode.Created).json({
        message: 'License created successfully',
        statusCode: HttpStatusCode.Created,
        data: result,
      });
    } catch (err) {
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
      const id = parseInt(req.params.id, 10);
      const updatedLicense = await this.licenseService.updateById(id, req.body);
      res.status(HttpStatusCode.Ok).json({
        message: 'License updated successfully',
        statusCode: HttpStatusCode.Ok,
        data: updatedLicense,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async index(req: Request, res: Response<ResponseApi<PaginationResult<LicenseAttributes>>>) {
    const { offset, limit, bast } = req.query;

    const licenses = await this.licenseService.getAll({
      limit: parseInt((limit as string) ?? '10', 10),
      offset: parseInt((offset as string) ?? '1', 10),
      searchConditions: [
        {
          keyValue: bast,
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
