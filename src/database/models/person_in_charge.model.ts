import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface PersonInChargeAttributes extends BaseModelAttributes {
  personName: string;
  flag: boolean;
}

export interface PersonInChargeCreationAttributes extends Omit<PersonInChargeAttributes, 'id'> {}

class PersonInCharge
  extends BaseModel<PersonInChargeAttributes, PersonInChargeCreationAttributes>
  implements PersonInChargeAttributes
{
  public personName!: string;
  public flag!: boolean;
}

PersonInCharge.init(
  {
    ...baseModelInit,
    personName: {
      type: DataTypes.STRING,
      field: 'person_name',
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
    tableName: 'person_in_charge_master',
  }
);

export default PersonInCharge;
