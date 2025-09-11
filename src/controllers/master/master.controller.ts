import { Request, Response } from 'express';
import { ResponseApi } from '@helper/interface/response.interface';
import PersonInCharge from '@database/models/masters/person_in_charge.model';
import { PersonInChargeService } from '@service/master/personInCharge.service';
import { ProcessError } from '@helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { StatusMasterService } from '@service/master/statusMaster.service';
import { ApplicationMasterService } from '@service/master/applicationMaster.service';
import Status from '@database/models/masters/status.model';
import Application from '@database/models/masters/application.model';
import MasterGroupService from '@service/master/masterGroup.service';
import MasterDepartmentService from '@service/master/masterDepartment.service';
import MasterVendorService from '@service/master/masterVendor.service';
import MasterGroup from '@database/models/masters/master_group.model';
import MasterDepartment from '@database/models/masters/master_department.model';
import MasterVendor from '@database/models/masters/master_vendor.model';

export class MasterController {
  private personInChargeService: PersonInChargeService;
  private statusMasterService: StatusMasterService;
  private applicationService: ApplicationMasterService;
  private masterGroupService: MasterGroupService;
  private masterDepartmentService: MasterDepartmentService;
  private masterVendorService: MasterVendorService;

  constructor() {
    this.personInChargeService = new PersonInChargeService();
    this.statusMasterService = new StatusMasterService();
    this.applicationService = new ApplicationMasterService();
    this.masterGroupService = new MasterGroupService();
    this.masterDepartmentService = new MasterDepartmentService();
    this.masterVendorService = new MasterVendorService();
  }

  async getAll(req: Request, res: Response<ResponseApi<any[]>>) {
    const query = req.query.type as string;
    // if (query === 'person_in_charge') {
    //   this.getAllPersonInCharge(req, res);
    // } else if (query === 'status') {
    //   this.getAllStatus(req, res);
    // } else if (query === 'application') {
    //   this.getAllApplications(req, res);
    // }

    switch (query) {
      case 'person_in_charge':
        this.getAllPersonInCharge(req, res);
        break;
      case 'status':
        this.getAllStatus(req, res);
        break;
      case 'application':
        this.getAllApplications(req, res);
        break;
      case 'group':
        this.getAllGroup(req, res);
        break;
      case 'department':
        this.getAllDepartment(req, res);
        break;
      case 'vendor':
        this.getAllVendor(req, res);
        break;
    }
  }

  async getAllPersonInCharge(req: Request, res: Response<ResponseApi<PersonInCharge[]>>) {
    try {
      const personInCharges = await this.personInChargeService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Person in charge list retrieved successfully',
        data: personInCharges,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllStatus(req: Request, res: Response<ResponseApi<Status[]>>) {
    try {
      const statuses = await this.statusMasterService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Status list retrieved successfully',
        data: statuses,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllApplications(req: Request, res: Response<ResponseApi<Application[]>>) {
    try {
      const applications = await this.applicationService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Application list retrieved successfully',
        data: applications,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllGroup(req: Request, res: Response<ResponseApi<MasterGroup[]>>) {
    try {
      const applications = await this.masterGroupService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Application list retrieved successfully',
        data: applications,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllDepartment(req: Request, res: Response<ResponseApi<MasterDepartment[]>>) {
    try {
      const applications = await this.masterDepartmentService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Application list retrieved successfully',
        data: applications,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllVendor(req: Request, res: Response<ResponseApi<MasterVendor[]>>) {
    try {
      const applications = await this.masterVendorService.fetchAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Application list retrieved successfully',
        data: applications,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
