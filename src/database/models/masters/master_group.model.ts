import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';

export interface MasterGroupAttributes extends BaseModelAttributes {
  name: string;
}

export interface MasterGroupCreationAttributes extends Omit<MasterGroupAttributes, 'id'> {}

class MasterGroup
  extends BaseModel<MasterGroupAttributes, MasterGroupCreationAttributes>
  implements MasterGroupAttributes
{
  public name!: string;
}

MasterGroup.init(
  {
    ...baseModelInit,
    name: {
      type: DataTypes.STRING,
      field: 'person_name',
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'master_groups',
  }
);

export default MasterGroup;
