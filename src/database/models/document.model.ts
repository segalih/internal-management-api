import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

export interface DocumentAttributes extends BaseModelAttributes {
  file_type: string;
  filename: string;
  path: string;
}

export interface DocumentCreationAttributes extends Omit<DocumentAttributes, 'id'> {}

class Document extends BaseModel<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public file_type!: string;
  public filename!: string;
  public path!: string;
}

Document.init(
  {
    ...baseModelInit,
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'documents',
  }
);

export default Document;
