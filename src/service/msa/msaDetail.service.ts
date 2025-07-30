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
    this.checkQuotaLimits(msa, data);

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

  async updateById(msaId: number, msaDetailId: number, data: CreateMsaDetailDto): Promise<MsaDetailAttributes> {
    const msaDetail = await MsaDetail.findByPk(msaDetailId, {
      include: [
        {
          model: Msa,
          as: 'msa',
          where: { id: msaId },
          include: [{ model: MsaDetail, as: 'details' }],
        },
      ],
    });

    if (!msaDetail || !msaDetail.msa) {
      throw new NotFoundException('MSA detail not found');
    }
    const payload = {
      ...data,
      id: msaDetailId,
    };
    this.checkQuotaLimits(msaDetail.msa, payload, true);

    const updatedMsaDetail = await msaDetail.update({
      name: data.name,
      rate: data.rate,
      role: data.role,
      project: data.project,
      groupPosition: data.group_position,
    });

    if (!updatedMsaDetail) {
      throw new UnprocessableEntityException('MSA detail not updated', {});
    }
    return updatedMsaDetail.toJSON();
  }

  totalPeople = (msaDetails: MsaDetailAttributes[]): number => {
    return msaDetails.length;
  };

  totalBudgetUsed = (msaDetails: MsaDetailAttributes[]): number => {
    return msaDetails.reduce((sum, detail) => sum + parseFloat(detail.rate.toString()), 0);
  };

  checkQuotaLimits = (msa: Msa, newMsaDetail: CreateMsaDetailDto | MsaDetail, isUpdate: boolean = false): void => {
    if (!msa.details) msa.details = [];
    let updatedMsaDetail: MsaDetail | null = null;
    if (isUpdate) {
      updatedMsaDetail = msa.details.find((detail) => detail.id === newMsaDetail.id) || null;
      if (!updatedMsaDetail) {
        throw new NotFoundException('MSA detail not found for update');
      }
    }

    const totalPeople = this.totalPeople(msa.details) + (isUpdate ? 0 : 1);
    const totalBudgetUsed =
      this.totalBudgetUsed(msa.details) - (isUpdate ? parseFloat(updatedMsaDetail?.rate.toString() ?? '0') : 0);

    const newBudget = parseFloat(newMsaDetail.rate.toString());
    const totalBudget = totalBudgetUsed + newBudget;

    if (totalPeople > msa.peopleQuota) {
      throw new UnprocessableEntityException('Maximum number of people exceeded', {
        maxPeople: msa.peopleQuota,
        totalPeople,
      });
    }

    if (totalBudget > msa.budgetQuota) {
      throw new UnprocessableEntityException(`Your budget limit has been exceeded. Please check your budget quota.`, {
        remainingBugdet: msa.budgetQuota - totalBudgetUsed,
        totalBudget: parseFloat(msa.budgetQuota.toString()),
      });
    }
  };
}
