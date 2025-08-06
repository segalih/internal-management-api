import { Transaction } from 'sequelize';
import { CreateMsaV2Dto } from '../../../common/dto/v2/msaV2/createMsaV2Dto';
import V2PksMsa, { V2PksMsaAttributes } from '../../../database/models/v2/v2_pks_msa.model';
import V2MsaHasRoles from '../../../database/models/v2/v2_msa_has_roles.model';

export class PksMsaV2Service {
  async create(data: CreateMsaV2Dto, transaction: Transaction): Promise<V2PksMsa> {
    const pksMsa = await V2PksMsa.create(
      {
        pks: data.pks,
        filePks: data.file_pks,
        fileBast: data.file_bast,
        dateStarted: data.date_started,
        dateEnded: data.date_ended,
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
    return {
      ...pksMsa.toJSON(),
    };
  }
}
