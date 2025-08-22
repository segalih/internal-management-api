// src/database/models/v2_pks_msa.model.ts
import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2Msa, { V2MsaAttributes } from './v2_msa.model';
import V2MsaHasRoles, { V2MsaHasRolesAttributes } from './v2_msa_has_roles.model';

export interface V2PksMsaAttributes extends BaseModelAttributes {
  pks: string;
  filePks?: string;
  fileBast?: string;
  dateStarted: Date;
  dateEnded: Date;
  peopleQuota: number;
  budgetQuota: number;

  msaDetails?: V2MsaAttributes[] | undefined | undefined[];
  roles?: V2MsaHasRoles[] | V2MsaHasRolesAttributes[];
  msas?: V2Msa[] | V2MsaAttributes[];

  budgetUsed?: number;
  remainingBudget?: number;
}

export interface V2PksMsaCreationAttributes extends Omit<V2PksMsaAttributes, 'id'> {}

export class V2PksMsa extends BaseModel<V2PksMsaAttributes, V2PksMsaCreationAttributes> implements V2PksMsaAttributes {
  public pks!: string;
  public filePks?: string;
  public fileBast?: string;
  public dateStarted!: Date;
  public dateEnded!: Date;
  public peopleQuota!: number;
  public budgetQuota!: number;

  pksMsa?: V2Msa[];
  roles?: V2MsaHasRoles[];
  msas?: V2Msa[];
}

V2PksMsa.init(
  {
    ...baseModelInit,
    pks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePks: {
      field: 'file_pks',
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileBast: {
      field: 'file_bast',
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateStarted: {
      field: 'date_started',
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const date = this.getDataValue('dateStarted');
        return date ? new Date(date).toISOString() : null;
      },
    },
    dateEnded: {
      field: 'date_ended',
      type: DataTypes.DATE,
      allowNull: false,
    },
    peopleQuota: {
      field: 'people_quota',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budgetQuota: {
      field: 'budget_quota',
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      get() {
        const rate = this.getDataValue('budgetQuota');
        return rate ? parseFloat(rate.toString()) : null;
      },
    },
  },
  {
    ...baseModelConfig,
    tableName: 'v2_pks_msa',
  }
);

export default V2PksMsa;
