import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import MasterGroup from './master_group.model';

export interface MasterDepartmentAttributes extends BaseModelAttributes {
  groupId: number;
  name: string;
}

export interface MasterDepartmentCreationAttributes extends Omit<MasterDepartmentAttributes, 'id'> {}

class MasterDepartment
  extends BaseModel<MasterDepartmentAttributes, MasterDepartmentCreationAttributes>
  implements MasterDepartmentAttributes
{
  public groupId!: number;
  public name!: string;
}

MasterDepartment.init(
  {
    ...baseModelInit,
    groupId: {
      type: DataTypes.INTEGER,
      field: 'group_id',
      allowNull: true,
      references: {
        model: {
          tableName: 'master_groups',
        },
        key: 'id',
      },
    },
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

MasterDepartment.belongsTo(MasterGroup, { foreignKey: 'groupId', targetKey: 'id', as: 'group' });
MasterGroup.hasMany(MasterDepartment, { foreignKey: 'groupId', sourceKey: 'id', as: 'departments' });

export default MasterDepartment;
