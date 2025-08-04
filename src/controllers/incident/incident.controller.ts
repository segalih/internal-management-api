import { Request, Response } from 'express';
import { IncidentService } from '../../service/incident/incident.service';
import Database from '../../../src/config/db';
import { ProcessError } from '../../helper/Error/errorHandler';
import { CreateIncidentDto } from '../../common/dto/incident/CreateIncidentDto';
import { ResponseApi } from '../../helper/interface/response.interface';
import Incident, { IncidentAttributes } from '../../database/models/incident.model';
import { HttpStatusCode } from 'axios';

export class IncidentController {
  private incidentService: IncidentService;
  constructor() {
    this.incidentService = new IncidentService();
  }

  async create(req: Request, res: Response<ResponseApi<IncidentAttributes>>) {
    const transaction = await Database.database.transaction();

    try {
      const incident = await this.incidentService.create(req.body as CreateIncidentDto, transaction);
      const result = await this.incidentService.getById(incident.id, transaction);
      await transaction.commit();
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: 'Incident created successfully',
        data: this.incidentService.incidentResponse(result),
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }
}
