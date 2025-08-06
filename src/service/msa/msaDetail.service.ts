import CreateMsaDetailDto from '../../common/dto/msa/CreateMsaDetailDto';
import Msa from '../../database/models/msa.model';
import MsaDetail, { MsaDetailAttributes } from '../../database/models/msa_detail.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { IMsaDetailService } from './msaDetail.type';

export default class MsaDetailService implements IMsaDetailService {
  constructor() {}

  async create(data: CreateMsaDetailDto, msaId: string): Promise<MsaDetail> {
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
    return msaDetail;
  }

  async createMany(data: CreateMsaDetailDto[], msaId: number): Promise<MsaDetail[]> {
    return await MsaDetail.bulkCreate(
      data.map((item) => ({
        msaId,
        name: item.name,
        project: item.project,
        role: item.role,
        rate: item.rate,
        groupPosition: item.group_position,
      }))
    );
  }

  async getById(id: number): Promise<MsaDetail | null> {
    const msaDetail = await MsaDetail.findByPk(id, {
      include: [{ model: Msa, as: 'msa' }],
    });
    if (!msaDetail) {
      throw new NotFoundException('MSA detail not found');
    }
    return msaDetail;
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

  public totalPeople = (msaDetails: MsaDetailAttributes[] | MsaDetail[]): number => {
    return msaDetails.length;
  };

  public totalBudgetUsed = (msaDetails: MsaDetailAttributes[] | MsaDetail[]): number => {
    return msaDetails.reduce((sum, detail) => sum + parseFloat(detail.rate.toString()), 0);
  };

  public checkQuotaLimits = (
    msa: Msa,
    newMsaDetail: CreateMsaDetailDto | MsaDetail,
    isUpdate: boolean = false
  ): void => {
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
  };

  async deleteById(id: number): Promise<void> {
    const msaDetail = await MsaDetail.findByPk(id);
    if (!msaDetail) {
      throw new NotFoundException('MSA detail not found');
    }
    await msaDetail.destroy();
  }

  async deleteMsaDetail(msaId: number, msaDetailId: number): Promise<void> {
    const msaDetail = await MsaDetail.findOne({
      where: { id: msaDetailId, msaId },
    });
    if (!msaDetail) {
      throw new NotFoundException('MSA detail not found');
    }
    await msaDetail.destroy();
  }
}
