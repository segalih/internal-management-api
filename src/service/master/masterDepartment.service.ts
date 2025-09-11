import MasterDepartment from '@database/models/masters/master_department.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';

class MasterDepartmentService {
  constructor() {}

  async getById(id: number): Promise<MasterDepartment> {
    const results = await MasterDepartment.findByPk(id);

    if (!results) {
      throw new NotFoundException('Person in charge not found', { id });
    }

    return results;
  }

  async fetchAll(groupId?: number): Promise<MasterDepartment[]> {
    const results = await MasterDepartment.findAll({
      where: { groupId: groupId ?? '' },
    });

    return results;
  }
}

export default MasterDepartmentService;
