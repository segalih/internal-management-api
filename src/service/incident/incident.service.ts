import { CreateIncidentDto } from '@common/dto/incident/CreateIncidentDto';
import Application from '@database/models/application.model';
import { PaginationResult, SearchCondition } from '@database/models/base.model';
import Incident, { IncidentAttributes } from '@database/models/incident.model';
import Link from '@database/models/link.model';
import PersonInCharge from '@database/models/person_in_charge.model';
import Status from '@database/models/status.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { ApplicationMasterService } from '@service/master/applicationMaster.service';
import { PersonInChargeService } from '@service/master/personInCharge.service';
import { StatusMasterService } from '@service/master/statusMaster.service';
import { DateTime } from 'luxon';
import { Transaction } from 'sequelize';

export class IncidentService {
  private statusService: StatusMasterService;
  private personInChargeService: PersonInChargeService;
  private applicationService: ApplicationMasterService;
  constructor() {
    this.statusService = new StatusMasterService();
    this.personInChargeService = new PersonInChargeService();
    this.applicationService = new ApplicationMasterService();
  }

  async create(data: CreateIncidentDto, transaction?: Transaction): Promise<Incident> {
    await this.applicationService.getById(data.application_id);
    await this.personInChargeService.getById(data.person_in_charge_id);
    await this.statusService.getById(data.status_id);

    const incident = await Incident.create(
      {
        ticketNumber: data.ticket_number,
        entryDate: data.entry_date,
        applicationId: data.application_id,
        personInChargeId: data.person_in_charge_id,
        issueCode: data.issue_code,
        title: data.title,
        detail: data.detail,
        statusId: data.status_id,
        temporaryAction: data.temporary_action,
        fullAction: data.full_action,
        rootCauseReason: data.root_cause_reason,
        category: data.category,
        rootCause: data.root_cause,
        note: data.note,
        deployDate: data.deploy_date,
      },
      {
        transaction,
      }
    );

    await Promise.all(
      (data.link ?? []).map((link) =>
        Link.create(
          {
            link,
            linkableId: incident.id,
            linkableType: 'incident',
          },
          { transaction }
        )
      )
    );

    return incident;
  }

  async getById(id: number, transaction?: Transaction): Promise<Incident> {
    const incident = await Incident.findByPk(id, {
      include: [
        {
          model: Link,
          as: 'incidentLinks',
        },
        {
          model: Status,
          as: 'status',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        {
          model: PersonInCharge,
          as: 'personInCharge',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        {
          model: Application,
          as: 'application',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
      transaction,
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  incidentResponse(incident: Incident): IncidentAttributes {
    const incidentLinks = incident.incidentLinks ?? [];

    const links = incidentLinks.map((link) => link.link);

    return {
      ...incident.toJSON(),
      links,
      incidentLinks: undefined,
      applicationId: incident.application?.id,
      personInChargeId: incident.personInCharge?.id,
      statusId: incident.status?.id,
    };
  }

  async updateById(id: number, data: CreateIncidentDto, transaction?: Transaction): Promise<Incident> {
    const incident = await this.getById(id, transaction);

    if (data.application_id) {
      await this.applicationService.getById(data.application_id);
    }
    if (data.person_in_charge_id) {
      await this.personInChargeService.getById(data.person_in_charge_id);
    }
    if (data.status_id) {
      await this.statusService.getById(data.status_id);
    }

    await incident.update(
      {
        ticketNumber: data.ticket_number,
        entryDate: data.entry_date,
        applicationId: data.application_id,
        personInChargeId: data.person_in_charge_id,
        issueCode: data.issue_code,
        title: data.title,
        detail: data.detail,
        statusId: data.status_id,
        temporaryAction: data.temporary_action,
        fullAction: data.full_action,
        rootCauseReason: data.root_cause_reason,
        category: data.category,
        rootCause: data.root_cause,
        note: data.note,
        deployDate: data.deploy_date,
      },
      { transaction }
    );
    if (data.link) {
      await Link.update(
        {
          deletedAt: DateTime.now().toJSDate(),
        },
        {
          where: {
            linkableId: incident.id,
            linkableType: 'incident',
          },
          transaction,
        }
      );

      await Promise.all(
        data.link.map((link) =>
          Link.create(
            {
              link,
              linkableId: incident.id,
              linkableType: 'incident',
            },
            { transaction }
          )
        )
      );
    }

    return incident.reload();
  }

  async deleteById(id: number, transaction?: Transaction): Promise<void> {
    const incident = await this.getById(id, transaction);
    await Incident.softDelete({ id });
  }

  async getAll(input: {
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: any;
  }): Promise<PaginationResult<Incident>> {
    const results = await Incident.paginate<Incident>({
      PerPage: input.perPage,
      page: input.page,
      searchConditions: input.searchConditions ?? [],
      sortOptions: input.sortOptions,
      includeConditions: [
        {
          model: Link,
          as: 'incidentLinks',
        },
        {
          model: Status,
          as: 'status',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        {
          model: PersonInCharge,
          as: 'personInCharge',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
        {
          model: Application,
          as: 'application',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
    });

    return results;
  }

  async getLastId(transaction?: Transaction): Promise<number> {
    const lastIncident = await Incident.findOne({
      order: [['id', 'DESC']],
    });

    return lastIncident ? lastIncident.id : 0;
  }
}
