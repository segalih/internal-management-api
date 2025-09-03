import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { DateTime } from 'luxon';
import { getDiffMonths, rupiahFormatter } from '../common';
import CreateMsaDetailV2Dto from '@common/dto/v2/msaV2/CreateMsaDetailV2Dto';
import V2MsaHasRoles from '@database/models/v2/v2_msa_has_roles.model';
import V2Msa from '@database/models/v2/v2_msa.model';
import _ from 'lodash';
import { MsaV2Service } from '@service/v2/msa/msaDetailV2.service';
import { Transaction } from 'sequelize';

export function validateMsaJoinDates(msa: CreateMsaDetailV2Dto[], dateStarted: string, dateEnded: string) {
  const start = DateTime.fromISO(dateStarted, { zone: 'UTC' });
  const end = DateTime.fromISO(dateEnded, { zone: 'UTC' });

  msa.forEach((item, index) => {
    const joinDate = DateTime.fromISO(item.join_date as string, { zone: 'UTC' });

    if (joinDate.toJSDate() < start.toJSDate()) {
      throw new BadRequestException(`Join date for msa [${index}] must be after date started and before date ended`);
    }

    if (joinDate.toJSDate() > end.toJSDate()) {
      throw new BadRequestException(`Join date for msa [${index}] must be before date ended`);
    }

    if (item.leave_date) {
      const leaveDate = DateTime.fromISO(item.leave_date as string, { zone: 'UTC' });

      if (leaveDate.toJSDate() < joinDate.toJSDate()) {
        throw new BadRequestException(`Leave date for msa [${index}] must be after join date`);
      }

      if (leaveDate.toJSDate() > end.toJSDate()) {
        throw new BadRequestException(`Leave date for msa [${index}] must be before date ended`);
      }
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

export async function ensureUniqueNIK(msaService: MsaV2Service, msaId: number, nik: string, transaction?: Transaction) {
  const msaCheck = await msaService.getWhere({ nik, isActive: true }, transaction);
  if (msaCheck) {
    throw new BadRequestException('NIK already exist and active');
  }
}

export function ensureUniqueProjects(projects: { name: string }[]) {
  const normalizedNames = projects.map((p) => p.name.trim().toLowerCase());

  const duplicates = _(normalizedNames)
    .countBy()
    .pickBy((count) => count > 1)
    .keys()
    .value();

  if (duplicates.length > 0) {
    throw new BadRequestException(`Duplicate project name(s): ${duplicates.join(', ')}`);
  }
}
