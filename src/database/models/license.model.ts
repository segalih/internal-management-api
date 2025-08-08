import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Document from './document.model';

export const LISENCE_CONSTANTS = {
  BASE_PATH: '/uploads/lisence/',
};
export interface LicenseAttributes extends BaseModelAttributes {
  pks: string;
  pksFileId?: number;
  bastFileId?: number;
  application: string;
  dueDateLicense: string;
  healthCheckRoutine: string;
  healthCheckActual: string;
  filePks: string;
  fileBast: string;

  pksFileUrl?: string;
  bastFileUrl?: string;
  pks_file_id?: number;
  bast_file_id?: number;
  status?: string;
}

export interface LicenseCreationAttributes extends Omit<LicenseAttributes, 'id'> {}

class License extends BaseModel<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public pks!: string;
  public pksFileId?: number;
  public bastFileId?: number;
  public application!: string;
  public dueDateLicense!: string;
  public healthCheckRoutine!: string;
  public healthCheckActual!: string;
  public filePks!: string;
  public fileBast!: string;
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
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue('dueDateLicense');
        return value ? new Date(value).toISOString() : null;
      },
    },
    healthCheckRoutine: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue('healthCheckRoutine');
        return value ? new Date(value).toISOString() : null;
      },
    },
    healthCheckActual: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue('healthCheckActual');
        return value ? new Date(value).toISOString() : null;
      },
    },
    filePks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileBast: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'licenses',
  }
);

License.belongsTo(Document, {
  foreignKey: 'pks_file_id',
  as: 'pksFile',
});

License.belongsTo(Document, {
  foreignKey: 'bast_file_id',
  as: 'bastFile',
});

export default License;
