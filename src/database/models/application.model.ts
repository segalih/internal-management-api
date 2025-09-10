import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface ApplicationAttributes extends BaseModelAttributes {
  applicationName: string;
  flag: boolean;
}

export interface ApplicationCreationAttributes extends Omit<ApplicationAttributes, 'id'> {}

class Application
  extends BaseModel<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public applicationName!: string;
  public flag!: boolean;
}

Application.init(
  {
    ...baseModelInit,
    applicationName: {
      type: DataTypes.STRING,
      field: 'application_name',
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
    tableName: 'master_applications',
  }
);

export default Application;
