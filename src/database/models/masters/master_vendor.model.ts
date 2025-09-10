import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';

export interface MasterVendorAttributes extends BaseModelAttributes {
  name: string;
}

export interface MasterVendorCreationAttributes extends Omit<MasterVendorAttributes, 'id'> {}

class MasterVendor
  extends BaseModel<MasterVendorAttributes, MasterVendorCreationAttributes>
  implements MasterVendorAttributes
{
  public name!: string;
}

MasterVendor.init(
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
    tableName: 'master_vendors',
  }
);

export default MasterVendor;
