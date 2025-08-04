import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Application from './application.model';
import PersonInCharge from './person_in_charge.model';
import Status from './status.model';
import IncidentLink from './incident_link.model';

export interface IncidentAttributes extends BaseModelAttributes {
  ticketNumber: string;
  entryDate: string;
  applicationId?: number;
  personInChargeId?: number;
  issueCode: string;
  title: string;
  detail: string;
  statusId?: number;
  temporaryAction: string;
  fullAction: string;
  rootCauseReason: string;
  category: string;
  rootCause: string;
  note: string;
  flag: boolean;
  updateDate: string;

  application?: Application;
  personInCharge?: PersonInCharge;
  status?: Status;
  links?: IncidentLink[];
}

export interface IncidentCreationAttributes extends Omit<IncidentAttributes, 'id'> {}

class Incident extends BaseModel<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  public ticketNumber!: string;
  public entryDate!: string;
  public applicationId?: number;
  public personInChargeId?: number;
  public issueCode!: string;
  public title!: string;
  public detail!: string;
  public statusId?: number;
  public temporaryAction!: string;
  public fullAction!: string;
  public rootCauseReason!: string;
  public category!: string;
  public rootCause!: string;
  public note!: string;
  public flag!: boolean;
  public updateDate!: string;

  public application?: Application;
  public personInCharge?: PersonInCharge;
  public status?: Status;
  public links?: IncidentLink[];
}

Incident.init(
  {
    ...baseModelInit,
    ticketNumber: {
      type: DataTypes.STRING,
      field: 'ticket_number',
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATE,
      field: 'entry_date',
      allowNull: false,
      get() {
        const value = this.getDataValue('entryDate');
        return value ? new Date(value).toISOString() : null;
      },
    },
    applicationId: {
      type: DataTypes.INTEGER,
      field: 'application_id',
      allowNull: true,
    },
    personInChargeId: {
      type: DataTypes.INTEGER,
      field: 'person_in_charge_id',
      allowNull: true,
    },
    issueCode: {
      type: DataTypes.STRING,
      field: 'issue_code',
    },
    title: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    statusId: {
      type: DataTypes.INTEGER,
      field: 'status_id',
      allowNull: true,
    },
    temporaryAction: {
      type: DataTypes.STRING,
      field: 'temporary_action',
    },
    fullAction: {
      type: DataTypes.STRING,
      field: 'full_action',
    },
    rootCauseReason: {
      type: DataTypes.STRING,
      field: 'root_cause_reason',
    },
    category: {
      type: DataTypes.STRING,
    },
    rootCause: {
      type: DataTypes.STRING,
      field: 'root_cause',
    },
    note: {
      type: DataTypes.STRING,
    },
    flag: {
      type: DataTypes.BOOLEAN,
      field: 'flag',
      defaultValue: true,
    },
    updateDate: {
      type: DataTypes.DATE,
      field: 'update_date',
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get() {
        const value = this.getDataValue('updateDate');
        return value ? new Date(value).toISOString() : null;
      },
    },
  },
  {
    ...baseModelConfig,
    tableName: 'incidents',
  }
);

// Associations
Incident.belongsTo(Application, {
  foreignKey: 'application_id',
  as: 'application',
});

Incident.belongsTo(PersonInCharge, {
  foreignKey: 'person_in_charge_id',
  as: 'personInCharge',
});

Incident.belongsTo(Status, {
  foreignKey: 'status_id',
  as: 'status',
});

Incident.hasMany(IncidentLink, {
  foreignKey: 'incident_id',
  as: 'links',
});

export default Incident;
