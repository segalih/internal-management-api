import MasterGroup from '@database/models/masters/master_group.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';

class MasterGroupService {
  constructor() {}

  async getById(id: number): Promise<MasterGroup> {
    const results = await MasterGroup.findByPk(id);

    if (!results) {
      throw new NotFoundException('Person in charge not found', { id });
    }

    return results;
  }

  async fetchAll(): Promise<MasterGroup[]> {
    const results = await MasterGroup.findAll();

    return results;
  }
}

export default MasterGroupService;
