import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Msa from './msa.model';

export interface MsaDetailAttributes extends BaseModelAttributes {
  msa_id: number;
  name: string;
  rate: number;
  role: string;
  project: string;
  group_position: string;
}

export interface MsaDetailCreationAttributes extends Omit<MsaDetailAttributes, 'id'> {}

class MsaDetail extends BaseModel<MsaDetailAttributes, MsaDetailCreationAttributes> implements MsaDetailAttributes {
  public msa_id!: number;
  public name!: string;
  public rate!: number;
  public role!: string;
  public project!: string;
  public group_position!: string;

  static associate(models: any) {
    MsaDetail.belongsTo(models.Msa, {
      foreignKey: 'msa_id',
      as: 'msa',
    });
  }
}

MsaDetail.init(
  {
    ...baseModelInit,
    msa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'msa_details',
  }
);

// MsaDetail.belongsTo(Msa, {
//   foreignKey: 'msa_id',
//   as: 'msa',
// });

export default MsaDetail;
