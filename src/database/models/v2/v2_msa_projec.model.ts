import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2Msa from './v2_msa.model';

export interface V2MsaProjectAttributes extends BaseModelAttributes {
  msaId: number;
  project: string;
  teamLeader: string;
}

export interface V2MsaProjectCreationAttributes extends Omit<V2MsaProjectAttributes, 'id'> {}

export class V2MsaProject
  extends BaseModel<V2MsaProjectAttributes, V2MsaProjectCreationAttributes>
  implements V2MsaProjectAttributes
{
  public msaId!: number;
  public project!: string;
  public teamLeader!: string;
}

V2MsaProject.init(
  {
    ...baseModelInit,
    msaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamLeader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'v2_msa_projects',
  }
);

V2MsaProject.belongsTo(V2Msa, { foreignKey: 'msaId', targetKey: 'id', as: 'msa3' });

V2Msa.hasMany(V2MsaProject, { foreignKey: 'msaId', sourceKey: 'id', as: 'projects' });

export default V2MsaProject;
