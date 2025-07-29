/// <reference path="../custom.d.ts" />
import { Request, Response } from 'express';
import { ProcessError } from '../../helper/Error/errorHandler';
import LicenseService from '../../service/license/license.service';
import { ResponseApi } from '../../helper/interface/response.interface';
import License, { LicenseAttributes } from '../../database/models/license.model';

export class LicenseController {
  private licenseService: LicenseService; // Replace with actual service type

  constructor() {
    this.licenseService = new LicenseService(); // Initialize with actual service instance
  }

  async create(req: Request, res: Response<ResponseApi<LicenseAttributes>>) {
    try {
      const result = await this.licenseService.create(req.body);
      res.status(201).json({
        message: 'License created successfully',
        statusCode: 201,
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
      res.status(200).json({
        message: 'License retrieved successfully',
        statusCode: 200,
        data: license,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
