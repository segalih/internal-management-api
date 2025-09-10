import MasterVendor from '@database/models/masters/master_vendor.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';

class MasterVendorService {
  constructor() {}

  async getById(id: number): Promise<MasterVendor> {
    const results = await MasterVendor.findByPk(id);

    if (!results) {
      throw new NotFoundException('Person in charge not found', { id });
    }

    return results;
  }

  async fetchAll(): Promise<MasterVendor[]> {
    const results = await MasterVendor.findAll();

    return results;
  }
}

export default MasterVendorService;
