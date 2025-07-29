/// <reference path="../custom.d.ts" />
import { Request, Response } from 'express';
import { ProcessError } from '../../helper/Error/errorHandler';
import LicenseService from '../../service/license/license.service';
import { ResponseApi } from '../../helper/interface/response.interface';
import License, { LicenseAttributes } from '../../database/models/license.model';
import { HttpStatusCode } from 'axios';

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
}
