import { Transaction } from 'sequelize';
import { CreateMsaV2Dto } from '@common/dto/v2/msaV2/createMsaV2Dto';
import { PaginationResult, SearchCondition, sortOptions } from '@database/models/base.model';
import V2Msa from '@database/models/v2/v2_msa.model';
import V2MsaHasRoles from '@database/models/v2/v2_msa_has_roles.model';
import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { pksMsaV2resource } from '@resource/v2/pks-msa/pks-msa.resource';
import { DateTime } from 'luxon';
import V2MsaProject from '@database/models/v2/v2_msa_project.model';
import { Op } from 'sequelize';
import MasterGroup from '@database/models/masters/master_group.model';
import MasterDepartment from '@database/models/masters/master_department.model';
import MasterVendor from '@database/models/masters/master_vendor.model';
export interface OtherSearchConditions {
  name?: string;
}
export class PksMsaV2Service {
  async create(data: CreateMsaV2Dto, transaction: Transaction): Promise<V2PksMsa> {
    const pksMsa = await V2PksMsa.create(
      {
        pks: data.pks,
        filePks: data.file_pks,
        fileBast: data.file_bast,
        dateStarted: DateTime.fromISO(data.date_started + 'T00:00:00.000+00:00', { zone: 'UTC' }).toJSDate(),
        dateEnded: DateTime.fromISO(data.date_ended + 'T23:59:59.999+00:00', { zone: 'UTC' }).toJSDate(),
        peopleQuota: data.people_quota,
        budgetQuota: data.budget_quota,
        thresholdAlert: data.threshold_alert ? data.threshold_alert : 20,
      },
      { transaction }
    );
    const roles = data.roles ?? [];

    if (roles) {
      await Promise.all(
        roles.map((role) =>
          V2MsaHasRoles.create(
            {
              pksMsaId: pksMsa.id,
              role: role.role,
              rate: role.rate,
            },
            { transaction }
          )
        )
      );
    }
    return pksMsa;
  }

  pksMsaResponse(pksMsa: V2PksMsa): V2PksMsaAttributes {
    return pksMsaV2resource(pksMsa);
  }

  async getById(id: number, transaction?: Transaction): Promise<V2PksMsa> {
    const pksMsa = await V2PksMsa.findByPk(id, {
      include: [
        {
          model: V2MsaHasRoles,
          as: 'roles',
        },
        {
          model: V2Msa,
          as: 'msas',
          include: [
            {
              model: V2MsaHasRoles,
              as: 'role',
            },
            {
              model: V2MsaProject,
              as: 'projects',
            },
            {
              model: MasterGroup,
              as: 'msaGroup',
            },
            {
              model: MasterDepartment,
              as: 'msaDepartment',
            },
            {
              model: MasterVendor,
              as: 'msaVendor',
            },
          ],
        },
      ],
      transaction,
    });
    if (!pksMsa) {
      throw new Error(`PKS MSA with ID ${id} not found`);
    }
    return pksMsa;
  }

  async deleteById(id: number, transaction?: Transaction): Promise<void> {
    const pksMsa = await V2PksMsa.findByPk(id, { transaction });
    if (!pksMsa) {
      throw new Error(`PKS MSA with ID ${id} not found`);
    }
    await pksMsa.destroy({ transaction });
  }

  async getAll(input: {
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: sortOptions;
    otherSearchConditions?: OtherSearchConditions;
  }): Promise<PaginationResult<V2PksMsa>> {
    const results = await V2PksMsa.paginate<V2PksMsa>({
      page: input.page,
      PerPage: input.perPage,
      searchConditions: input.searchConditions || [],
      sortOptions: input.sortOptions,
      includeConditions: [
        {
          model: V2MsaHasRoles,
          as: 'roles',
        },
        {
          model: V2Msa,
          as: 'msas',
          where: input.otherSearchConditions?.name
            ? { name: { [Op.like]: `%${input.otherSearchConditions.name}%` } }
            : undefined,
          include: [
            {
              model: V2MsaHasRoles,
              as: 'role',
            },
            {
              model: V2MsaProject,
              as: 'projects',
            },
            {
              model: MasterGroup,
              as: 'msaGroup',
            },
            {
              model: MasterDepartment,
              as: 'msaDepartment',
            },
            {
              model: MasterVendor,
              as: 'msaVendor',
            },
          ],
        },
      ],
    });

    return results;
  }
}
