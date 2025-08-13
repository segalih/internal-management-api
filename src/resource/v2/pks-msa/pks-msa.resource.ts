import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { getDiffMonths } from '@helper/function/common';
import { msaV2resource } from './msa.resource';
import { roleV2resource } from './role.resource';
import { mapRolesToMsa } from '@helper/function/v2';

export const pksMsaV2resource = (pksMsa: V2PksMsa): V2PksMsaAttributes => {
  const msaDetails = pksMsa.msas ?? [];
  const roles = pksMsa.roles ?? [];

  const monthsPerMsa = msaDetails.map((item) => getDiffMonths(item.joinDate!, pksMsa.dateEnded));
  const mappedRoles = mapRolesToMsa(msaDetails, roles);
  const budgets = mappedRoles.map((role, i) => role.rate * monthsPerMsa[i]);
  const totalBudget = budgets.reduce((acc, cur) => acc + (cur || 0), 0);

  const remainingBudget = pksMsa.budgetQuota - totalBudget;

  return {
    id: pksMsa.id,
    pks: pksMsa.pks,
    filePks: pksMsa.filePks,
    fileBast: pksMsa.fileBast,
    dateStarted: pksMsa.dateStarted,
    dateEnded: pksMsa.dateEnded,
    peopleQuota: pksMsa.peopleQuota,
    budgetQuota: pksMsa.budgetQuota,
    budgetUsed: totalBudget,
    remainingBudget,
    roles: roles.map((role) => roleV2resource(role)!),
    msaDetails: msaDetails.map((msa) => msaV2resource(msa)),
  };
};
