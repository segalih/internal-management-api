import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
// import Roles from './role.model';
// import Branch from './branch.model';

// User Interface
export interface UserAttributes extends BaseModelAttributes {
  name: string;
  email: string;
  password: string;

  // image_id: number | null;
  // branch_id?: number | null;
  // name: string;
  // gender?: string;
  // email: string;
  // address: string;
  // phoneNumber: string;
  // referralCode: string | null;
  // role_id: number;
  // birthdate?: Date | null;
  // isDeleted: boolean;
  // isVerified: boolean;
  // resetPasswordToken?: string | null;
  // verifyToken?: string | null;
  // password: string;
  // role?: { role: string; permission: { permission: string }[] };
  // branch?: { name: string };
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
// export interface UserInstance extends Required<UserAttributes> {}
// Sequelize Model
class Users extends BaseModel<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public name!: string;
  public email!: string;
  public password!: string;

  // public id!: number;
  // public image_id!: number | null;
  // public branch_id!: number | null;
  // public name!: string;
  // public gender?: string | undefined;
  // public email!: string;
  // public password!: string;
  // public address!: string;
  // public phoneNumber!: string;
  // public referralCode!: string | null;
  // public role_id!: number;
  // public birthdate!: Date | null;
  // public isDeleted!: boolean;
  // public isVerified!: boolean;
  // public resetPasswordToken!: string | null;
  // public verifyToken!: string | null;
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
  // public readonly deletedAt!: Date;
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
  },
  {
    ...baseModelConfig,
    tableName: 'users',
  }
);

// Users.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
// Roles.hasMany(Users, { sourceKey: 'id', foreignKey: 'role_id', as: 'user' });

// Users.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
// Branch.hasMany(Users, { sourceKey: 'id', foreignKey: 'branch_id', as: 'user' });

export default Users;
