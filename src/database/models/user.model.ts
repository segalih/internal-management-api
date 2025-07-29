import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';


// User Interface
export interface UserAttributes extends BaseModelAttributes {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Sequelize Model
class Users extends BaseModel<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

Users.init(
  {
    ...baseModelInit,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'officer', 'staff'),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'users',
  }
);

export default Users;
