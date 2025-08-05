import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Incident from './incident.model';

export interface IncidentLinkAttributes extends BaseModelAttributes {
  incidentId: number;
  linkUrl: string;
}

export interface IncidentLinkCreationAttributes extends Omit<IncidentLinkAttributes, 'id'> {}

class IncidentLink
  extends BaseModel<IncidentLinkAttributes, IncidentLinkCreationAttributes>
  implements IncidentLinkAttributes
{
  public incidentId!: number;
  public linkUrl!: string;
}

IncidentLink.init(
  {
    ...baseModelInit,
    incidentId: {
      type: DataTypes.INTEGER,
      field: 'incident_id',
      allowNull: false,
    },
    linkUrl: {
      type: DataTypes.STRING,
      field: 'link_url',
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'incident_links',
  }
);



Incident.hasMany(IncidentLink, {
  foreignKey: 'incident_id',
  as: 'links',
});

IncidentLink.belongsTo(Incident, {
  foreignKey: 'incident_id',
  as: 'incidentParent',
});

export default IncidentLink;
