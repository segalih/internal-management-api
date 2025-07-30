import CreateMsaDetailDto from '../../common/dto/msa/CreateMsaDetailDto';
import Msa from '../../database/models/msa.model';
import MsaDetail, { MsaDetailAttributes } from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

export default class MsaDetailService {
  constructor() {}

  async create(data: CreateMsaDetailDto, msaId: string): Promise<MsaDetailAttributes> {
    const msa = await Msa.findByPk(msaId, {
      include: [
        {
          model: MsaDetail,
          as: 'details',
        },
      ],
    });
    if (!msa) {
      throw new NotFoundException('MSA not found');
    }
    if (!msa.details) msa.details = [];

    const totalPeople = msa.details.length + 1;
    const totalBudgetUsed = msa.details.reduce((sum, detail) => sum + parseFloat(detail.rate.toString()), 0);
    const newBudget = parseFloat(data.rate.toString());
    const totalBudget = totalBudgetUsed + newBudget;

    if (totalPeople > msa.peopleQuota) {
      throw new UnprocessableEntityException('Maximum number of people exceeded', {
        maxPeople: msa.peopleQuota,
        totalPeople,
      });
    }

    if (totalBudgetUsed + newBudget > msa.budgetQuota) {
      throw new UnprocessableEntityException(
        `Budget limit exceeded, remaining: ${msa.budgetQuota - totalBudgetUsed}, total: ${msa.budgetQuota}`,
        {
          remainingBugdet: msa.budgetQuota - totalBudgetUsed,
          totalBudget: msa.budgetQuota,
        }
      );
    }

    const msaDetail = await MsaDetail.create({
      name: data.name,
      rate: data.rate,
      role: data.role,
      project: data.project,
      groupPosition: data.group_position,
      msaId: parseInt(msaId, 10),
    });
    if (!msaDetail) {
      throw new UnprocessableEntityException('MSA detail not created', {});
    }
    return msaDetail.toJSON();
  }
}
