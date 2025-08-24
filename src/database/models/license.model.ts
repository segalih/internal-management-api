import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import LicenseHealthcheck from './license_healthcheck.model';

export const LISENCE_CONSTANTS = {
  BASE_PATH: '/uploads/lisence/',
};
export interface LicenseAttributes extends BaseModelAttributes {
  pks: string;
  pksFileId?: number | null;
  bastFileId?: number | null;
  application: string;
  dueDateLicense: Date;
  filePks: string;
  fileBast: string;
  isNotified: boolean;

  pksFileUrl?: string;
  bastFileUrl?: string;
  status?: string;
  healthchecks?: LicenseHealthcheck[];
}

export interface LicenseCreationAttributes extends Omit<LicenseAttributes, 'id'> {}

class License extends BaseModel<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public pks!: string;
  public pksFileId?: number;
  public bastFileId?: number;
  public application!: string;
  public dueDateLicense!: Date;
  public filePks!: string;
  public fileBast!: string;
  public isNotified!: boolean;
  public healthchecks?: LicenseHealthcheck[];
}

License.init(
  {
    ...baseModelInit,
    pks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pksFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documents',
        key: 'id',
      },
    },
    bastFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documents',
        key: 'id',
      },
    },
    application: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDateLicense: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    filePks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileBast: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'licenses',
  }
);


export default License;
