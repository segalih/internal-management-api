import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { DateTime } from 'luxon';
import { getDiffMonths, rupiahFormatter } from '../common';
import CreateMsaDetailV2Dto from '@common/dto/v2/msaV2/CreateMsaDetailV2Dto';
import V2MsaHasRoles from '@database/models/v2/v2_msa_has_roles.model';
import V2Msa from '@database/models/v2/v2_msa.model';

export function validateMsaJoinDates(msa: CreateMsaDetailV2Dto[], dateStarted: string, dateEnded: string) {
  const start = DateTime.fromISO(dateStarted, { zone: 'UTC' });
  const end = DateTime.fromISO(dateEnded, { zone: 'UTC' });
  msa.forEach((item, index) => {
    const joinDate = DateTime.fromISO(item.join_date as string, { zone: 'UTC' });

    if (joinDate < start || joinDate > end) {
      throw new BadRequestException(`Join date for msa ${index + 1} must be after date started and before date ended`);
    }
  });
}

export function validatePeopleQuota(total: number, quota: number) {
  if (total > quota) {
    throw new BadRequestException(
      `Total people quota for the contract exceeds the allowed quota. Total: ${total}, Quota: ${quota}`
    );
  }
}

export function mapRolesToMsa(msa: CreateMsaDetailV2Dto[] | V2Msa[], roles: V2MsaHasRoles[]) {
  return msa.map((item) => {
    // Ambil roleId dengan aman (bisa camelCase atau snake_case)
    const _roleId = 'role_id' in item ? (item as CreateMsaDetailV2Dto).role_id : (item as V2Msa).roleId;

    const role = roles.find((r) => r.id === _roleId);

    if (!role) {
      throw new BadRequestException(`Role with ID ${_roleId} not found in PKS MSA`);
    }

    return role;
  });
}

export function validateBudgetQuota(
  msa: CreateMsaDetailV2Dto[],
  mappedRoles: V2MsaHasRoles[],
  pksDateEnded: string,
  budgetQuota: number
) {
  const monthsPerMsa = msa.map((item) => getDiffMonths(item.join_date!, item.leave_date ?? pksDateEnded));
  const budgets = mappedRoles.map((role, i) => role.rate * monthsPerMsa[i]);
  const totalBudget = budgets.reduce((acc, cur) => acc + (cur || 0), 0);

  if (totalBudget > budgetQuota) {
    throw new BadRequestException(
      `Total budget exceeds quota. Total: ${rupiahFormatter(totalBudget)}, Quota: ${rupiahFormatter(budgetQuota)}`
    );
  }
}
