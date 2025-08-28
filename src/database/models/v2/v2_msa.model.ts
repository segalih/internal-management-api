// src/database/models/v2_msa.model.ts
import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2MsaHasRoles, { V2MsaHasRolesAttributes } from './v2_msa_has_roles.model';
import V2PksMsa from './v2_pks_msa.model';
import V2MsaProject, { V2MsaProjectAttributes } from './v2_msa_project.model';

export interface V2MsaAttributes extends BaseModelAttributes {
  pksMsaId: number;
  roleId: number;
  name: string;
  groupPosition: string;
  joinDate?: Date;
  leaveDate?: Date;
  isActive: boolean;
  nik: string;

  projects?: V2MsaProjectAttributes[];

  role?: V2MsaHasRoles | V2MsaHasRolesAttributes;
}

export interface V2MsaCreationAttributes extends Omit<V2MsaAttributes, 'id'> {}

export class V2Msa extends BaseModel<V2MsaAttributes, V2MsaCreationAttributes> implements V2MsaAttributes {
  public pksMsaId!: number;
  public roleId!: number;
  public name!: string;
  public groupPosition!: string;
  public joinDate?: Date;
  public leaveDate?: Date;
  public isActive!: boolean;
  public nik!: string;

  projects?: V2MsaProject[] | V2MsaProjectAttributes[];

  public role?: V2MsaHasRoles;
}

V2Msa.init(
  {
    ...baseModelInit,
    pksMsaId: {
      field: 'pks_msa_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'v2_pks_msa',
        },
        key: 'id',
      },
    },
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupPosition: {
      field: 'group_position',
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
    leaveDate: {
      field: 'leave_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    nik: {
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
V2Msa.belongsTo(V2MsaHasRoles, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
// V2MsaHasRoles.hasMany(V2Msa, { foreignKey: 'roleId', as: '' });

V2Msa.belongsTo(V2PksMsa, { foreignKey: 'pksMsaId', targetKey: 'id', as: 'pksMsa' });
V2PksMsa.hasMany(V2Msa, { foreignKey: 'pksMsaId', sourceKey: 'id', as: 'msas' });

export default V2Msa;
