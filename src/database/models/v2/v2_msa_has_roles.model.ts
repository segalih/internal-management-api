// src/database/models/v2_msa_has_roles.model.ts
import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2PksMsa, { V2PksMsaAttributes } from './v2_pks_msa.model';

export interface V2MsaHasRolesAttributes extends BaseModelAttributes {
  pksMsaId: number;
  role: string;
  rate: number;

  pksMsa?: V2PksMsa | V2PksMsaAttributes;
}

export interface V2MsaHasRolesCreationAttributes extends Omit<V2MsaHasRolesAttributes, 'id'> {}

export class V2MsaHasRoles
  extends BaseModel<V2MsaHasRolesAttributes, V2MsaHasRolesCreationAttributes>
  implements V2MsaHasRolesAttributes
{
  public pksMsaId!: number;
  public role!: string;
  public rate!: number;

  public pksMsa?: V2PksMsa;
}

V2MsaHasRoles.init(
  {
    ...baseModelInit,
    pksMsaId: {
      field: 'pks_msa_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      get() {
        const rate = this.getDataValue('rate');
        return rate ? parseFloat(rate.toString()) : null;
      },
    },
  },
  {
    ...baseModelConfig,
    tableName: 'v2_msa_has_roles',
  }
);

// Relasi
V2MsaHasRoles.belongsTo(V2PksMsa, { foreignKey: 'pksMsaId', targetKey: 'id', as: 'pksMsa' });
V2PksMsa.hasMany(V2MsaHasRoles, { foreignKey: 'pksMsaId', sourceKey: 'id', as: 'roles' });

export default V2MsaHasRoles;
