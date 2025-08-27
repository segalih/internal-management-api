import V2Msa, { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import { roleV2resource } from './role.resource';
import { projectResource } from './project.resource';

export const msaV2resource = (msa: V2Msa | V2MsaAttributes): V2MsaAttributes => {
  return {
    id: msa.id,
    roleId: msa.roleId,
    name: msa.name,
    project: msa.project,
    groupPosition: msa.groupPosition,
    pksMsaId: msa.pksMsaId,
    role: msa.role! && roleV2resource(msa.role!),
    isActive: msa.isActive,
    joinDate: msa.joinDate ? msa.joinDate : undefined,
    leaveDate: msa.leaveDate ? msa.leaveDate : undefined,
    projects: msa.projects && msa.projects.map((project) => projectResource(project)),
  };
};
