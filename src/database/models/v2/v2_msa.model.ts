// src/database/models/v2_msa.model.ts
import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2MsaHasRoles from './v2_msa_has_roles.model';

export interface V2MsaAttributes extends BaseModelAttributes {
  roleId: number;
  name: string;
  project: string;
  groupPosition: string;
}

export interface V2MsaCreationAttributes extends Omit<V2MsaAttributes, 'id'> {}

export class V2Msa extends BaseModel<V2MsaAttributes, V2MsaCreationAttributes> implements V2MsaAttributes {
  public roleId!: number;
  public name!: string;
  public project!: string;
  public groupPosition!: string;
}

V2Msa.init(
  {
    ...baseModelInit,
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupPosition: {
      field: 'group_position',
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'v2_msa',
  }
);

// Relasi
V2Msa.belongsTo(V2MsaHasRoles, { foreignKey: 'roleId', as: 'role' });
V2MsaHasRoles.hasMany(V2Msa, { foreignKey: 'roleId', as: 'msas' });

export default V2Msa;
