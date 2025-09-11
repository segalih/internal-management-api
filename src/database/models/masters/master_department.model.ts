import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';

export interface MasterDepartmentAttributes extends BaseModelAttributes {
  name: string;
}

export interface MasterDepartmentCreationAttributes extends Omit<MasterDepartmentAttributes, 'id'> {}

class MasterDepartment
  extends BaseModel<MasterDepartmentAttributes, MasterDepartmentCreationAttributes>
  implements MasterDepartmentAttributes
{
  public name!: string;
}

MasterDepartment.init(
  {
    ...baseModelInit,
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'master_departments',
  }
);

export default MasterDepartment;
