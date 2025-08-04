import { Transaction } from 'sequelize';
import { CreateIncidentDto } from '../../common/dto/incident/CreateIncidentDto';
import Incident, { IncidentAttributes } from '../../database/models/incident.model';
import IncidentLink from '../../database/models/incident_link.model';
import { ApplicationMasterService } from '../master/applicationMaster.service';
import { PersonInChargeService } from '../master/personInCharge.service';
import { StatusMasterService } from '../master/statusMaster.service';
import Status from '../../database/models/status.model';
import PersonInCharge from '../../database/models/person_in_charge.model';
import Application from '../../database/models/application.model';

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
      },
      {
        transaction,
      }
    );

    if (data.link) {
      await IncidentLink.create(
        {
          incidentId: incident.id,
          linkUrl: data.link,
        },
        { transaction }
      );
    }

    return incident;
  }

  async getById(id: number, transaction: Transaction): Promise<Incident> {
    const incident = await Incident.findByPk(id, {
      include: [
        {
          model: IncidentLink,
          as: 'links',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'incidentId', 'deletedAt'],
          },
        },
        {
          model: Status,
          as: 'status',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'incidentId', 'deletedAt'],
          },
        },
        {
          model: PersonInCharge,
          as: 'personInCharge',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'incidentId', 'deletedAt'],
          },
        },
        {
          model: Application,
          as: 'application',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'incidentId', 'deletedAt'],
          },
        },
      ],
      transaction,
    });

    if (!incident) {
      throw new Error('Incident not found');
    }

    return incident;
  }

  incidentResponse(incident: Incident): IncidentAttributes {
    return {
      ...incident.toJSON(),
    };
  }
}
