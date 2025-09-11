import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';

export interface MasterVendorApplicationAttributes extends BaseModelAttributes {
  name: string;
}

export interface MasterVendorApplicationCreationAttributes extends Omit<MasterVendorApplicationAttributes, 'id'> {}

class MasterVendorApplication
  extends BaseModel<MasterVendorApplicationAttributes, MasterVendorApplicationCreationAttributes>
  implements MasterVendorApplicationAttributes
{
  public name!: string;
}

MasterVendorApplication.init(
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
    tableName: 'master_vendor_applications',
  }
);

export default MasterVendorApplication;
