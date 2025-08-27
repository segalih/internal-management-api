import { Transaction } from 'sequelize';
import CreateMsaDetailV2Dto from '@common/dto/v2/msaV2/CreateMsaDetailV2Dto';
import V2Msa, { V2MsaAttributes } from '@database/models/v2/v2_msa.model';
import V2MsaHasRoles from '@database/models/v2/v2_msa_has_roles.model';
import { UnprocessableEntityException } from '@helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { msaV2resource } from '@resource/v2/pks-msa/msa.resource';
import { DateTime } from 'luxon';
import V2MsaProject from '@database/models/v2/v2_msa_projec.model';

export class MsaV2Service {
  async create(pksMsaId: number, data: CreateMsaDetailV2Dto, transaction?: Transaction): Promise<V2Msa> {
    const msa = await V2Msa.create(
      {
        name: data.name,
        pksMsaId: pksMsaId,
        project: data.project,
        roleId: data.role_id,
        groupPosition: data.group_position,
        joinDate: DateTime.fromISO(data.join_date as string, { zone: 'UTC' }).toJSDate()!,
        leaveDate: data.leave_date
          ? DateTime.fromISO(data.leave_date + 'T23:59:59.999+00:00', { zone: 'UTC' }).toJSDate()!
          : undefined,
        isActive: data.leave_date ? false : true,
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
        {
          model: V2MsaProject,
          as: 'projects',
        },
      ],
      transaction,
    });

    if (!msa) {
      throw new UnprocessableEntityException('MSA not found', {});
    }

    return msa;
  }

  async deleteByMsaId(pksMsaId: number, transaction?: Transaction): Promise<void> {
    const msa = await V2Msa.destroy({
      where: { pksMsaId },
      transaction,
    });
  }

  async getByPksId(pksId: number, transaction?: Transaction): Promise<V2MsaAttributes[]> {
    const msa = await V2Msa.findAll({
      where: { pksMsaId: pksId },
      include: [
        {
          model: V2MsaHasRoles,
          as: 'role',
        },
        {
          model: V2MsaProject,
          as: 'projects',
        },
      ],
      transaction,
    });
    return msa.map((item) => msaV2resource(item));
  }
}
