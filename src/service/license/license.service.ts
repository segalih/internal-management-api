import { CreateLisenceDto } from '../../common/dto/lisence/CreateLisenceDto';
import License from '../../database/models/license.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export default class LicenseService {
  constructor() {}

  async getById(id: number) {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    return license;
  }

  async create(data: CreateLisenceDto) {
    const license = await License.create({
      pks: data.pks,
      bast: data.bast,
      aplikasi: data.aplikasi,
      dueDateLicense: data.due_date_license,
      healthCheckRoutine: data.health_check_routine,
      healthCheckActual: data.health_check_actual,
    });
    if (!license) {
      throw new NotFoundException('License not created');
    }
    return license;
  }
}
