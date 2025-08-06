import V2MsaHasRoles, { V2MsaHasRolesAttributes } from '../../../database/models/v2/v2_msa_has_roles.model';

export const roleV2resource = (role: V2MsaHasRoles): V2MsaHasRolesAttributes => {
  return {
    id: role.id,
    pksMsaId: role.pksMsaId,
    role: role.role,
    rate: role.rate,
  };
};
