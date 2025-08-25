import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import Database from '@config/db';
import { CreateIncidentDto } from '@common/dto/incident/CreateIncidentDto';
import { IncidentAttributes } from '@database/models/incident.model';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { ProcessError } from '@helper/Error/errorHandler';
import { isStringNumber } from '@helper/function/common';
import { ResponseApi, ResponseApiWithPagination } from '@helper/interface/response.interface';
import { IncidentService } from '@service/incident/incident.service';
import { SearchCondition } from '@database/models/base.model';
import { Op } from 'sequelize';

export class IncidentController {
  private incidentService: IncidentService;
  constructor() {
    this.incidentService = new IncidentService();
  }

  async create(req: Request, res: Response<ResponseApi<IncidentAttributes>>) {
    const transaction = await Database.database.transaction();

    try {
      const dateNow = DateTime.now();
      const ticketNumber = `FCS${dateNow.toFormat('yyyyMMdd')}-${(await this.incidentService.getLastId()) + 1}`;

      const incident = await this.incidentService.create(
        { ...req.body, ticket_number: ticketNumber, entry_date: dateNow.toISO() } as CreateIncidentDto,
        transaction
      );
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

  async update(req: Request, res: Response<ResponseApi<IncidentAttributes>>) {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid incident ID format');
      }

      const incident = await this.incidentService.updateById(parseInt(id), req.body as CreateIncidentDto, transaction);
      const result = await this.incidentService.getById(incident.id, transaction);
      await transaction.commit();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Incident updated successfully',
        data: this.incidentService.incidentResponse(result),
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }

  async show(req: Request, res: Response<ResponseApi<IncidentAttributes>>) {
    const { id } = req.params;

    if (!isStringNumber(id)) {
      throw new BadRequestException('Invalid incident ID format');
    }

    try {
      const incident = await this.incidentService.getById(parseInt(id));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Incident retrieved successfully',
        data: this.incidentService.incidentResponse(incident),
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async index(req: Request, res: Response<ResponseApiWithPagination<IncidentAttributes>>) {
    try {
      const { page = 1, per_page = 10 } = req.query;

      const {
        entry_date_from,
        entry_date_to,
        application_id,
        person_in_charge_id,
        status_id,
        ticket_number,
        title,
        issue_code,
      } = req.query;

      const searchConditions: SearchCondition[] = [
        {
          keySearch: 'entryDate',
          operator: Op.gte,
          keyValue: entry_date_from ? DateTime.fromISO(entry_date_from as string, { zone: 'UTC' }).toISO() : '',
          keyColumn: 'entryDate',
        },
        {
          keySearch: 'entryDate',
          operator: Op.lte,
          keyValue: entry_date_to
            ? DateTime.fromISO(entry_date_to as string, { zone: 'UTC' })
              .toISO()
            : '',
          keyColumn: 'entryDate',
        },
        {
          keySearch: 'application_id',
          operator: Op.eq,
          keyValue: application_id ?? '',
          keyColumn: 'application_id',
        },
        {
          keySearch: 'personInChargeId',
          operator: Op.eq,
          keyValue: person_in_charge_id ?? '',
          keyColumn: 'personInChargeId',
        },
        {
          keySearch: 'statusId',
          operator: Op.eq,
          keyValue: status_id ?? '',
          keyColumn: 'statusId',
        },
        {
          keySearch: 'ticketNumber',
          operator: Op.like,
          keyValue: ticket_number ? `%${ticket_number as string}%` : '',
          keyColumn: 'ticketNumber',
        },
        {
          keySearch: 'title',
          operator: Op.like,
          keyValue: title ? `%${title as string}%` : '',
          keyColumn: 'title',
        },
        {
          keySearch: 'issueCode',
          operator: Op.like,
          keyValue: issue_code ? `%${issue_code as string}%` : '',
          keyColumn: 'issueCode',
        },
      ];

      const incidents = await this.incidentService.getAll({
        page: page ? parseInt(page as string) : 1,
        perPage: per_page ? parseInt(per_page as string) : 10,
        searchConditions,
      });
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Incidents retrieved successfully',
        data: incidents.data.map((incident) => this.incidentService.incidentResponse(incident)),
        meta: {
          currentPage: incidents.currentPage,
          totalPages: incidents.totalPages,
          totalCount: incidents.totalCount,
          pageSize: incidents.pageSize,
        },
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async delete(req: Request, res: Response<ResponseApi<null>>) {
    const transaction = await Database.database.transaction();

    try {
      const { id } = req.params;

      if (!isStringNumber(id)) {
        throw new BadRequestException('Invalid incident ID format');
      }

      await this.incidentService.deleteById(parseInt(id), transaction);
      await transaction.commit();
      res.status(HttpStatusCode.NoContent).json({
        statusCode: HttpStatusCode.NoContent,
        message: 'Incident deleted successfully',
        data: null,
      });
    } catch (error) {
      await transaction.rollback();
      ProcessError(error, res);
    }
  }
}
