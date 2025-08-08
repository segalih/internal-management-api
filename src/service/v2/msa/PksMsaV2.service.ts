import { Transaction } from 'sequelize';
import { CreateMsaV2Dto } from '@common/dto/v2/msaV2/createMsaV2Dto';
import { PaginationResult, SearchCondition, sortOptions } from '@database/models/base.model';
import V2Msa from '@database/models/v2/v2_msa.model';
import V2MsaHasRoles from '@database/models/v2/v2_msa_has_roles.model';
import V2PksMsa, { V2PksMsaAttributes } from '@database/models/v2/v2_pks_msa.model';
import { pksMsaV2resource } from '@resource/v2/pks-msa/pks-msa.resource';
import { DateTime } from 'luxon';

export class PksMsaV2Service {
  async create(data: CreateMsaV2Dto, transaction: Transaction): Promise<V2PksMsa> {
    const pksMsa = await V2PksMsa.create(
      {
        pks: data.pks,
        filePks: data.file_pks,
        fileBast: data.file_bast,
        dateStarted: data.date_started,
        dateEnded: DateTime.fromISO(data.date_ended + 'T23:59:59.999+00:00').toFormat('yyyy-MM-dd HH:mm:ss'),
        peopleQuota: data.people_quota,
        budgetQuota: data.budget_quota,
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
          include: [
            {
              model: V2MsaHasRoles,
              as: 'role',
            },
          ],
        },
      ],
    });

    return results;
  }
}
