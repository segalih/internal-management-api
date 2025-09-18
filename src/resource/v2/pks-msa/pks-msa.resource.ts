import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { dateToIsoString, getDiffMonths } from '@helper/function/common';
import { msaV2resource } from './msa.resource';
import { roleV2resource } from './role.resource';
import { mapRolesToMsa } from '@helper/function/v2';
import { DateTime } from 'luxon';

export const pksMsaV2resource = (pksMsa: V2PksMsa): V2PksMsaAttributes => {
  const msaDetails = pksMsa.msas ?? [];
  const roles = pksMsa.roles ?? [];

  const monthsPerMsa = msaDetails.map((item) =>
    getDiffMonths(
      dateToIsoString(item.joinDate!),
      item.leaveDate ? dateToIsoString(item.leaveDate) : dateToIsoString(pksMsa.dateEnded)
    )
  );
  const mappedRoles = mapRolesToMsa(msaDetails, roles);
  const budgets = mappedRoles.map((role, i) => {
    return role.rate * monthsPerMsa[i];
  });
  const budgetUsed = budgets.reduce((acc, cur) => acc + (cur || 0), 0);

  const remainingBudget = pksMsa.budgetQuota - budgetUsed;
  const budgedUsedRatio = Math.ceil((remainingBudget / pksMsa.budgetQuota) * 100);

  const isBudgetBelowThreshold = budgedUsedRatio < pksMsa.thresholdAlert ? true : false;

  const monthsUntilExpired = getDiffMonths(dateToIsoString(new Date()), dateToIsoString(pksMsa.dateEnded));
  const isPksExpiringSoon = monthsUntilExpired <= 3;

  return {
    id: pksMsa.id,
    pks: pksMsa.pks,
    filePks: pksMsa.filePks,
    fileBast: pksMsa.fileBast,
    dateStarted: pksMsa.dateStarted,
    dateEnded: pksMsa.dateEnded,
    peopleQuota: pksMsa.peopleQuota,
    budgetQuota: pksMsa.budgetQuota,
    thresholdAlert: pksMsa.thresholdAlert,
    isActive: pksMsa.dateEnded > DateTime.now().toJSDate(),
    isBudgetBelowThreshold,
    budgetUsed,
    remainingBudget,
    isPksExpiringSoon,
    status: pksStatus(monthsUntilExpired),
    roles: roles.map((role) => roleV2resource(role)!),
    msaDetails: msaDetails.map((msa) => msaV2resource(msa)),
  };
};

function pksStatus(monthsUntilExpired: number): string {
  if (monthsUntilExpired <= 0) {
    return 'expired';
  } else if (monthsUntilExpired < 3) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
}