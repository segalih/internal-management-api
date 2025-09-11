import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import LicenseHealthcheck, { LicenseHealthcheckAttributes } from './license_healthcheck.model';
import MasterVendorApplication, { MasterVendorApplicationAttributes } from './masters/master_vendor_application.model';

export const LISENCE_CONSTANTS = {
  BASE_PATH: '/uploads/lisence/',
};
export interface LicenseAttributes extends BaseModelAttributes {
  pks: string;
  pksFileId?: number | null;
  bastFileId?: number | null;
  application: string;
  dueDateLicense: Date;
  // healthCheckRoutine: Date;
  // healthCheckActual: Date;
  filePks: string;
  fileBast: string;
  isNotified: boolean;
  dateStarted?: Date;
  vendor_id?: number;
  descriptions?: string;

  pksFileUrl?: string;
  bastFileUrl?: string;
  // pks_file_id?: number;
  // bast_file_id?: number;
  status?: string;
  healthchecks?: LicenseHealthcheck[] | LicenseHealthcheckAttributes[];
  vendor?: MasterVendorApplication | MasterVendorApplicationAttributes;
}

export interface LicenseCreationAttributes extends Omit<LicenseAttributes, 'id'> {}

class License extends BaseModel<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public pks!: string;
  public pksFileId?: number;
  public bastFileId?: number;
  public application!: string;
  public dueDateLicense!: Date;

  public dateStarted?: Date;
  public vendor_id?: number;
  public descriptions?: string;

  // public healthCheckRoutine!: Date;
  // public healthCheckActual!: Date;
  public filePks!: string;
  public fileBast!: string;
  public isNotified!: boolean;
  public healthchecks?: LicenseHealthcheck[] | LicenseHealthcheckAttributes[];
  public vendor?: MasterVendorApplication | MasterVendorApplicationAttributes;
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
    dateStarted: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'master_vendor_applications',
        key: 'id',
      },
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filePks: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fileBast: {
      type: DataTypes.TEXT,
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

License.belongsTo(MasterVendorApplication, {
  foreignKey: 'vendor_id',
  targetKey: 'id',
  as: 'vendor',
});

MasterVendorApplication.hasMany(License, {
  foreignKey: 'vendor_id',
  sourceKey: 'id',
  as: 'licenses3',
});

export default License;
