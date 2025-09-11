import V2Msa, { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import { roleV2resource } from './role.resource';
import { projectResource } from './project.resource';
import { masterVendorResource } from '@resource/master/vendor.resource';
import { masterGroupResource } from '@resource/master/group.resource';
import { masterDepartmentResource } from '@resource/master/department.resource';

export const msaV2resource = (msa: V2Msa | V2MsaAttributes): V2MsaAttributes => {
  return {
    id: msa.id,
    roleId: msa.roleId,
    name: msa.name,
    pksMsaId: msa.pksMsaId,
    nik: msa.nik,
    isActive: msa.isActive,
    joinDate: msa.joinDate ? msa.joinDate : undefined,
    leaveDate: msa.leaveDate ? msa.leaveDate : undefined,
    role: msa.role! && roleV2resource(msa.role!),
    projects: msa.projects && msa.projects.map((project) => projectResource(project)),
    group: msa.msaGroup && masterGroupResource(msa.msaGroup),
    department: msa.msaDepartment && masterDepartmentResource(msa.msaDepartment),
    vendor: msa.msaVendor && masterVendorResource(msa.msaVendor),
  };
};
