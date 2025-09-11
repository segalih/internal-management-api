import MasterVendorApplication from '@database/models/masters/master_vendor_application.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';

class MasterVendorApplicationService {
  constructor() {}

  async getById(id: number): Promise<MasterVendorApplication> {
    const results = await MasterVendorApplication.findByPk(id);

    if (!results) {
      throw new NotFoundException('Person in charge not found', { id });
    }

    return results;
  }

  async fetchAll(): Promise<MasterVendorApplication[]> {
    const results = await MasterVendorApplication.findAll();

    return results;
  }
}

export default MasterVendorApplicationService;
