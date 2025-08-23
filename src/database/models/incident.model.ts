import { DataTypes } from 'sequelize';
import Application from './application.model';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Link from './link.model';
import PersonInCharge from './person_in_charge.model';
import Status from './status.model';

export interface IncidentAttributes extends BaseModelAttributes {
  ticketNumber: string;
  entryDate: Date;
  applicationId?: number;
  personInChargeId?: number;
  issueCode: string;
  title: string;
  detail: string;
  statusId?: number;
  temporaryAction?: string;
  fullAction?: string;
  rootCauseReason?: string;
  category?: string;
  rootCause?: string;
  note?: string;
  flag?: boolean;
  deployDate?: Date;

  application?: Application;
  personInCharge?: PersonInCharge;
  status?: Status;
  links?: string[];
  incidentLinks?: Link[];
}

export interface IncidentCreationAttributes extends Omit<IncidentAttributes, 'id'> {}

class Incident extends BaseModel<IncidentAttributes, IncidentCreationAttributes> implements IncidentAttributes {
  public ticketNumber!: string;
  public entryDate!: Date;
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
  public deployDate?: Date;

  public application?: Application;
  public personInCharge?: PersonInCharge;
  public status?: Status;
  public links?: string[];
  public incidentLinks?: Link[];
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
      allowNull: true,
    },
    fullAction: {
      type: DataTypes.STRING,
      field: 'full_action',
      allowNull: true,
    },
    rootCauseReason: {
      type: DataTypes.STRING,
      field: 'root_cause_reason',
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rootCause: {
      type: DataTypes.STRING,
      field: 'root_cause',
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flag: {
      type: DataTypes.BOOLEAN,
      field: 'flag',
      defaultValue: true,
    },
    deployDate: {
      type: DataTypes.DATE,
      field: 'deploy_date',
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'incidents',
  }
);

// Associations
Incident.belongsTo(Application, {
  foreignKey: 'applicationId',
  targetKey: 'id',
  as: 'application',
});

Incident.belongsTo(PersonInCharge, {
  foreignKey: 'personInChargeId',
  targetKey: 'id',
  as: 'personInCharge',
});

Incident.belongsTo(Status, {
  foreignKey: 'statusId',
  targetKey: 'id',
  as: 'status',
});

Application.hasMany(Incident, {
  foreignKey: 'applicationId',
  sourceKey: 'id',
  as: 'applicationIncidents',
});

PersonInCharge.hasMany(Incident, {
  foreignKey: 'personInChargeId',
  sourceKey: 'id',
  as: 'personInChargeIncidents',
});

Status.hasMany(Incident, {
  foreignKey: 'statusId',
  sourceKey: 'id',
  as: 'statusIncidents',
});





export default Incident;
