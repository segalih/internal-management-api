import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import MsaDetail, { MsaDetailAttributes } from './msa_detail.model';

export interface MsaAttributes extends BaseModelAttributes {
  pks: string;
  file_pks: string;
  file_bast: string;
  dateStarted: Date;
  dateEnded: Date;
  peopleQuota: number;
  budgetQuota: number;

  pksFileUrl?: string;
  bastFileUrl?: string;
}

export interface MsaCreationAttributes extends Omit<MsaAttributes, 'id'> {}

class Msa extends BaseModel<MsaAttributes, MsaCreationAttributes> implements MsaAttributes {
  public pks!: string;
  public file_pks!: string;
  public file_bast!: string;
  public dateStarted!: Date;
  public dateEnded!: Date;
  public budgetQuota!: number;
  public peopleQuota!: number;

  public details?: MsaDetail[];
}

Msa.init(
  {
    ...baseModelInit,
    pks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_pks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_bast: {
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

export default Msa;
