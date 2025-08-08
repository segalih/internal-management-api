import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { getDiffMonths } from '@helper/function/common';
import { msaV2resource } from './msa.resource';
import { roleV2resource } from './role.resource';

export const pksMsaV2resource = (pksMsa: V2PksMsa): V2PksMsaAttributes => {
  const msaDetails = pksMsa.pksMsa ?? [];
  const roles = pksMsa.roles ?? [];
  const currentBudgetList = pksMsa.msas?.map((item) => item.role?.rate || 0) || [];
  const totalBudget = currentBudgetList.reduce((acc, cur) => acc + (cur || 0), 0);
  const totalOfMonthsContract = getDiffMonths(pksMsa.dateStarted, pksMsa.dateEnded);

  const budgetUsed = totalBudget * totalOfMonthsContract;
  const remainingBudget = pksMsa.budgetQuota - budgetUsed;
  return {
    id: pksMsa.id,
    pks: pksMsa.pks,
    filePks: pksMsa.filePks,
    fileBast: pksMsa.fileBast,
    dateStarted: pksMsa.dateStarted,
    dateEnded: pksMsa.dateEnded,
    peopleQuota: pksMsa.peopleQuota,
    budgetQuota: pksMsa.budgetQuota,
    budgetUsed,
    remainingBudget,
    roles: roles.map((role) => roleV2resource(role)!),
    msaDetails: msaDetails.map((msa) => msaV2resource(msa)),
  };
};
