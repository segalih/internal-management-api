import { Transaction } from 'sequelize';
import CreateMsaDetailV2Dto from '../../../common/dto/v2/msaV2/CreateMsaDetailV2Dto';
import V2Msa from '../../../database/models/v2/v2_msa.model';
import V2MsaHasRoles from '../../../database/models/v2/v2_msa_has_roles.model';
import { UnprocessableEntityException } from '../../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

export class MsaV2Service {
  async create(pksMsaId: number, data: CreateMsaDetailV2Dto, transaction?: Transaction): Promise<V2Msa> {
    const msa = await V2Msa.create(
      {
        name: data.name,
        pksMsaId: pksMsaId,
        project: data.project,
        roleId: data.role_id,
        groupPosition: data.group_position,
      },
      {
        transaction,
      }
    );

    if (!msa) {
      throw new UnprocessableEntityException('failed when creating MSA', {});
    }

    return msa;
  }

  async getById(id: number, transaction?: Transaction): Promise<V2Msa> {
    const msa = await V2Msa.findByPk(id, {
      include: [
        {
          model: V2MsaHasRoles,
          as: 'role',
        },
      ],
      transaction,
    });

    if (!msa) {
      throw new UnprocessableEntityException('MSA not found', {});
    }

    return msa;
  }
}
