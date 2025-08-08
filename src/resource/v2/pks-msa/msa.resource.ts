import V2Msa, { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import V2PksMsa from '@database/models/v2/v2_pks_msa.model';
import { roleV2resource } from './role.resource';

export const msaV2resource = (msa: V2Msa): V2MsaAttributes => {
  return {
    id: msa.id,
    roleId: msa.roleId,
    name: msa.name,
    project: msa.project,
    groupPosition: msa.groupPosition,
    pksMsaId: msa.pksMsaId,
    role: roleV2resource(msa.role!),
  };
};
