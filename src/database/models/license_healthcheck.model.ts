import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import License from './license.model';

export interface LicenseHealthcheckAttributes extends BaseModelAttributes {
  licenseId: number;
  healthcheckRoutineDate: Date;
  healthcheckActualDate?: Date;
}

export interface LicenseHealthcheckCreationAttributes extends Omit<LicenseHealthcheckAttributes, 'id'> {}

class LicenseHealthcheck
  extends BaseModel<LicenseHealthcheckAttributes, LicenseHealthcheckCreationAttributes>
  implements LicenseHealthcheckAttributes
{
  public licenseId!: number;
  public healthcheckRoutineDate!: Date;
  public healthcheckActualDate?: Date;
}

LicenseHealthcheck.init(
  {
    ...baseModelInit,
    licenseId: {
      type: DataTypes.INTEGER,
      field: 'license_id',
      allowNull: false,
    },
    healthcheckRoutineDate: {
      type: DataTypes.DATE,
      field: 'healthcheck_routine_date',
      allowNull: false,
    },
    healthcheckActualDate: {
      type: DataTypes.DATE,
      field: 'healthcheck_actual_date',
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'license_healthchecks',
  }
);

LicenseHealthcheck.belongsTo(License, {
  foreignKey: 'licenseId',
  targetKey: 'id',
  as: 'license',
});

License.hasMany(LicenseHealthcheck, {
  foreignKey: 'licenseId',
  sourceKey: 'id',
  as: 'healthchecks',
});

export default LicenseHealthcheck;
