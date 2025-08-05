import { Request, Response } from 'express';
import { ResponseApi } from '../../helper/interface/response.interface';
import PersonInCharge from '../../database/models/person_in_charge.model';
import { PersonInChargeService } from '../../service/master/personInCharge.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { StatusMasterService } from '../../service/master/statusMaster.service';
import { ApplicationMasterService } from '../../service/master/applicationMaster.service';
import Status from '../../database/models/status.model';
import Application from '../../database/models/application.model';

export class MasterController {
  private personInChargeService: PersonInChargeService;
  private statusMasterService: StatusMasterService;
  private applicationService: ApplicationMasterService;

  constructor() {
    this.personInChargeService = new PersonInChargeService();
    this.statusMasterService = new StatusMasterService();
    this.applicationService = new ApplicationMasterService();
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
}
