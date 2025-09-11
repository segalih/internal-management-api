import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from '../base.model';

export interface StatusAttributes extends BaseModelAttributes {
  statusName: string;
  flag: boolean;
}

export interface StatusCreationAttributes extends Omit<StatusAttributes, 'id'> {}

class Status extends BaseModel<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
  public statusName!: string;
  public flag!: boolean;
}

Status.init(
  {
    ...baseModelInit,
    statusName: {
      type: DataTypes.STRING,
      field: 'status_name',
      allowNull: false,
    },
    flag: {
      type: DataTypes.BOOLEAN,
      field: 'flag',
      defaultValue: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'master_statuses',
  }
);

export default Status;
