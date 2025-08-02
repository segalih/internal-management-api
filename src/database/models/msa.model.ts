import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import MsaDetail, { MsaDetailAttributes } from './msa_detail.model';
import Document from './document.model';

export const MSA_CONSTANTS = {
  BASE_PATH: '/uploads/pks_msa/',
};

export interface MsaAttributes extends BaseModelAttributes {
  pks: string;
  dateStarted: string;
  dateEnded: string;
  peopleQuota: number;
  budgetQuota: number;
  pksFileId?: number;
  bastFileId?: number;

  pksFileUrl?: string;
  bastFileUrl?: string;
}

export interface MsaCreationAttributes extends Omit<MsaAttributes, 'id'> {}

class Msa extends BaseModel<MsaAttributes, MsaCreationAttributes> implements MsaAttributes {
  public pks!: string;
  public dateStarted!: string;
  public dateEnded!: string;
  public budgetQuota!: number;
  public peopleQuota!: number;
  public pksFileId?: number | undefined;
  public bastFileId?: number | undefined;

  public details?: MsaDetail[];
  public pksFile?: Document;
  public bastFile?: Document;
}

Msa.init(
  {
    ...baseModelInit,
    pks: {
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
    pksFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bastFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'msa',
  }
);

Document.hasOne(Msa, {
  foreignKey: 'pks_file_id',
  as: 'pksUsedIn',
});

Document.hasOne(Msa, {
  foreignKey: 'bast_file_id',
  as: 'bastUsedIn',
});

Msa.belongsTo(Document, {
  foreignKey: 'pks_file_id',
  as: 'pksFile',
});

Msa.belongsTo(Document, {
  foreignKey: 'bast_file_id',
  as: 'bastFile',
});

export default Msa;
