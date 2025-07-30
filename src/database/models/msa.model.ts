import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import MsaDetail from './msa_detail.model';

export interface MsaAttributes extends BaseModelAttributes {
  pks: string;
  bast: string;
  dateStarted: Date;
  dateEnded: Date;
  peopleQuota: number;
  budgetQuota: number;
}

export interface MsaCreationAttributes extends Omit<MsaAttributes, 'id'> {}

class Msa extends BaseModel<MsaAttributes, MsaCreationAttributes> implements MsaAttributes {
  public pks!: string;
  public bast!: string;
  public dateStarted!: Date;
  public dateEnded!: Date;
  public budgetQuota!: number;
  public peopleQuota!: number;

  static associate(models: any) {
    Msa.hasMany(models.MsaDetail, {
      foreignKey: 'msa_id',
      as: 'details',
    });
  }
}

Msa.init(
  {
    ...baseModelInit,
    pks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bast: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateStarted: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateEnded: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    peopleQuota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budgetQuota: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'msa',
  }
);
// Msa.hasMany(MsaDetail, {
//   foreignKey: 'msa_id',
//   as: 'details',
// });

export default Msa;
