import V2MsaHasRoles, { V2MsaHasRolesAttributes } from '@database/models/v2/v2_msa_has_roles.model';
import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { msaV2resource } from './msa.resource';
import { pksMsaV2resource } from './pks-msa.resource';

export const roleV2resource = (role: V2MsaHasRoles | V2MsaHasRolesAttributes): V2MsaHasRolesAttributes => {
  // let pksMsa: V2PksMsaAttributes | undefined = undefined;
  // if (role.pksMsa) {
  //   pksMsa = {
  //     id: role.pksMsa.id,
  //     pks: role.pksMsa.pks,
  //     filePks: role.pksMsa.filePks,
  //     fileBast: role.pksMsa.fileBast,
  //     dateStarted: role.pksMsa.dateStarted,
  //     dateEnded: role.pksMsa.dateEnded,
  //     peopleQuota: role.pksMsa.peopleQuota,
  //     thresholdAlert: role.pksMsa.thresholdAlert,
  //     budgetQuota: role.pksMsa.budgetQuota,
  //     msaDetails: role.pksMsa.pksMsa?.map((msa) => msaV2resource(msa)),
  //   };
  // }

  return {
    id: role.id,
    pksMsaId: role.pksMsaId,
    role: role.role,
    rate: role.rate,
    pksMsa: role.pksMsa && pksMsaV2resource(role.pksMsa as V2PksMsa),
  };
};
