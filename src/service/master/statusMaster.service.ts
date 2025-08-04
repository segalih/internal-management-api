import Status from '../../database/models/status.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export class StatusMasterService {
  constructor() {}

  async getStatusById(id: number): Promise<Status> {
    const status = await Status.findByPk(id);

    if (!status) {
      throw new NotFoundException('Status not found', { id });
    }

    return status;
  }

  async fetchAll(): Promise<Status[]> {
    const status = await Status.findAll();
    return status;
  }
}
