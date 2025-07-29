import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

export interface LicenseAttributes extends BaseModelAttributes {
  pks: string;
  bast: string;
  aplikasi: string;
  dueDateLicense: Date;
  healthCheckRoutine: Date;
  healthCheckActual: Date;
}

export interface LicenseCreationAttributes extends Omit<LicenseAttributes, 'id'> {}

class License extends BaseModel<LicenseAttributes, LicenseCreationAttributes> implements LicenseAttributes {
  public pks!: string;
  public bast!: string;
  public aplikasi!: string;
  public dueDateLicense!: Date;
  public healthCheckRoutine!: Date;
  public healthCheckActual!: Date;
}

License.init(
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
    aplikasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDateLicense: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    healthCheckRoutine: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    healthCheckActual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'licenses',
  }
);

export default License;
