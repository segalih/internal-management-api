import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Incident from './incident.model';
import Msa from './msa.model';
import License from './license.model';

export interface LinkAttributes extends BaseModelAttributes {
  link: string;
  linkableId: number;
  linkableType: string;
}

export interface LinkCreationAttributes extends Omit<LinkAttributes, 'id'> {}

class Link extends BaseModel<LinkAttributes, LinkCreationAttributes> implements LinkAttributes {
  public link!: string;
  public linkableId!: number;
  public linkableType!: string;
}

Link.init(
  {
    ...baseModelInit,
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linkableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'linkable_id',
    },
    linkableType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'linkable_type',
    },
  },
  {
    ...baseModelConfig,
    tableName: 'links',
  }
);

Link.belongsTo(Incident, {
  foreignKey: 'linkableId',
  targetKey: 'id',
  constraints: false,
  scope: {
    linkable_type: 'incident',
  },
});

// Link.belongsTo(Msa, {
//   foreignKey: 'linkableId',
//   constraints: false,
//   scope: {
//     linkable_type: 'msa',
//   },
// });

// Link.belongsTo(License, {
//   foreignKey: 'linkableId',
//   constraints: false,
//   scope: {
//     linkable_type: 'license',
//   },
// });

Incident.hasMany(Link, {
  foreignKey: 'linkableId',
  sourceKey: 'id',
  constraints: false,
  scope: {
    linkable_type: 'incident',
  },
  as: 'incidentLinks',
});

// Msa.hasMany(Link, {
//   foreignKey: 'linkableId',
//   constraints: false,
//   scope: {
//     linkable_type: 'msa',
//   },
//   as: 'msaLinks',
// });

// License.hasMany(Link, {
//   foreignKey: 'linkableId',
//   constraints: false,
//   scope: {
//     linkable_type: 'license',
//   },
//   as: 'licenseLinks',
// });

export default Link;
