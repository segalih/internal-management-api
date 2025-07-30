import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Msa from './msa.model';

export interface MsaDetailAttributes extends BaseModelAttributes {
  msaId: number;
  name: string;
  rate: number;
  role: string;
  project: string;
  groupPosition: string;
}

export interface MsaDetailCreationAttributes extends Omit<MsaDetailAttributes, 'id'> {}

class MsaDetail extends BaseModel<MsaDetailAttributes, MsaDetailCreationAttributes> implements MsaDetailAttributes {
  public msaId!: number;
  public name!: string;
  public rate!: number;
  public role!: string;
  public project!: string;
  public groupPosition!: string;

  public msa?: Msa;
}

MsaDetail.init(
  {
    ...baseModelInit,
    msaId: {
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
    groupPosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'msa_details',
  }
);

MsaDetail.belongsTo(Msa, {
  foreignKey: 'msaId',
  as: 'msa',
});
Msa.hasMany(MsaDetail, {
  foreignKey: 'msaId',
  as: 'details',
});

export default MsaDetail;
