import V2PksMsa, { V2PksMsaAttributes } from '../../../database/models/v2/v2_pks_msa.model';
import { msaV2resource } from './msa.resource';
import { roleV2resource } from './role.resource';

export const pksMsaV2resource = (pksMsa: V2PksMsa): V2PksMsaAttributes => {
  const msaDetails = pksMsa.pksMsa ?? [];
  const roles = pksMsa.roles ?? [];
  return {
    id: pksMsa.id,
    pks: pksMsa.pks,
    filePks: pksMsa.filePks,
    fileBast: pksMsa.fileBast,
    dateStarted: pksMsa.dateStarted,
    dateEnded: pksMsa.dateEnded,
    peopleQuota: pksMsa.peopleQuota,
    budgetQuota: pksMsa.budgetQuota,
    roles: roles.map((role) => roleV2resource(role)!),
    msaDetails: msaDetails.map((msa) => msaV2resource(msa)),
  };
};
