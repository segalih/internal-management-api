// src/database/models/v2_msa.model.ts
import { DataTypes } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from '../base.model';
import V2MsaHasRoles, { V2MsaHasRolesAttributes } from './v2_msa_has_roles.model';
import V2PksMsa from './v2_pks_msa.model';
import V2MsaProject, { V2MsaProjectAttributes } from './v2_msa_project.model';
import MasterGroup, { MasterGroupAttributes } from '../masters/master_group.model';
import MasterDepartment, { MasterDepartmentAttributes } from '../masters/master_department.model';
import MasterVendor, { MasterVendorAttributes } from '../masters/master_vendor.model';

export interface V2MsaAttributes extends BaseModelAttributes {
  pksMsaId: number;
  roleId: number;
  name: string;
  joinDate?: Date;
  leaveDate?: Date;
  isActive: boolean;
  nik: string;
  groupId?: number;
  departmentId?: number;
  vendorId?: number;

  msaGroup?: MasterGroup | MasterGroupAttributes;
  msaDepartment?: MasterDepartment | MasterDepartmentAttributes;
  msaVendor?: MasterVendor | MasterVendorAttributes;

  projects?: V2MsaProjectAttributes[];

  role?: V2MsaHasRoles | V2MsaHasRolesAttributes;
  group?: MasterGroup | MasterGroupAttributes;
  department?: MasterDepartment | MasterDepartmentAttributes;
  vendor?: MasterVendor | MasterVendorAttributes;
}

export interface V2MsaCreationAttributes extends Omit<V2MsaAttributes, 'id'> {}

export class V2Msa extends BaseModel<V2MsaAttributes, V2MsaCreationAttributes> implements V2MsaAttributes {
  public pksMsaId!: number;
  public roleId!: number;
  public name!: string;
  public joinDate?: Date;
  public leaveDate?: Date;
  public isActive!: boolean;
  public nik!: string;
  public groupId?: number;
  public departmentId?: number;
  public vendorId?: number;

  public msaGroup?: MasterGroup | MasterGroupAttributes;
  public msaDepartment?: MasterDepartment | MasterDepartmentAttributes;
  public msaVendor?: MasterVendor | MasterVendorAttributes;

  projects?: V2MsaProject[] | V2MsaProjectAttributes[];

  public group?: MasterGroup | MasterGroupAttributes;
  public department?: MasterDepartment | MasterDepartmentAttributes;
  public vendor?: MasterVendor | MasterVendorAttributes;

  public role?: V2MsaHasRoles;
}

V2Msa.init(
  {
    ...baseModelInit,
    pksMsaId: {
      field: 'pks_msa_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'v2_pks_msa',
        },
        key: 'id',
      },
    },
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
    leaveDate: {
      field: 'leave_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupId: {
      field: 'group_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'master_groups',
        },
        key: 'id',
      },
    },
    departmentId: {
      field: 'department_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'master_departments',
        },
        key: 'id',
      },
    },
    vendorId: {
      field: 'vendor_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'master_vendors',
        },
        key: 'id',
      },
    },
  },
  {
    ...baseModelConfig,
    tableName: 'v2_msa',
  }
);

// Relasi
V2Msa.belongsTo(V2MsaHasRoles, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
// V2MsaHasRoles.hasMany(V2Msa, { foreignKey: 'roleId', as: '' });

V2Msa.belongsTo(V2PksMsa, { foreignKey: 'pksMsaId', targetKey: 'id', as: 'pksMsa' });
V2PksMsa.hasMany(V2Msa, { foreignKey: 'pksMsaId', sourceKey: 'id', as: 'msas' });

V2Msa.belongsTo(MasterGroup, { foreignKey: 'groupId', targetKey: 'id', as: 'msaGroup' });
V2Msa.belongsTo(MasterDepartment, { foreignKey: 'departmentId', targetKey: 'id', as: 'msaDepartment' });
V2Msa.belongsTo(MasterVendor, { foreignKey: 'vendorId', targetKey: 'id', as: 'msaVendor' });
export default V2Msa;
