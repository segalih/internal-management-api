import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Msa from './msa.model';

export interface MsaHasRoleAttributes extends BaseModelAttributes {
  msaId: number;
  role: string;
  rate: number;
}

export interface MsaHasRoleCreationAttributes extends Omit<MsaHasRoleAttributes, 'id'> {}

class MsaHasRole extends BaseModel<MsaHasRoleAttributes, MsaHasRoleCreationAttributes> implements MsaHasRoleAttributes {
  public msaId!: number;
  public role!: string;
  public rate!: number;

  public msa?: Msa;
}

MsaHasRole.init(
  {
    ...baseModelInit,
    msaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'msa',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'msa_has_roles',
  }
);

MsaHasRole.belongsTo(Msa, { foreignKey: 'msaId', as: 'msaHaRole' });
Msa.hasMany(MsaHasRole, { foreignKey: 'msaId', as: 'msaRoles' });

export default MsaHasRole;
