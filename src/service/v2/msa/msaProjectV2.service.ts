import { CreateMsaProjectV2Dto } from '@common/dto/v2/msaV2/CreateMsaProjectV2Dto';
import V2MsaProject from '@database/models/v2/v2_msa_project.model';
import { Transaction } from 'sequelize';

export class MsaProjectV2Service {
  constructor() {}

  async create(msaId: number, data: CreateMsaProjectV2Dto, transaction?: Transaction): Promise<V2MsaProject> {
    return V2MsaProject.create(
      {
        msaId,
        project: data.project,
        teamLeader: data.team_leader,
      },
      {
        transaction,
      }
    );
  }

  async getByMsaId(msaId: number): Promise<V2MsaProject[]> {
    return V2MsaProject.findAll({ where: { msaId } });
  }
}
