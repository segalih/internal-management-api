import Application from '../../database/models/application.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export class ApplicationMaster {
  constructor() {}

  async getById(id: number): Promise<Application> {
    const application = await Application.findByPk(id);

    if (!application) {
      throw new NotFoundException('Application not found', { id });
    }

    return application;
  }
}
