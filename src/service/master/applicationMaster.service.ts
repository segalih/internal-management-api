import Application from '@database/models/masters/application.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';

export class ApplicationMasterService {
  constructor() {}

  async getById(id: number): Promise<Application> {
    const application = await Application.findByPk(id);

    if (!application) {
      throw new NotFoundException('Application not found', { id });
    }

    return application;
  }

  async fetchAll(): Promise<Application[]> {
    const applications = await Application.findAll({
      order: [['applicationName', 'ASC']],
    });

    return applications;
  }
}
