import { Op } from 'sequelize';
import { CreateLisenceDto } from '../../common/dto/lisence/CreateLisenceDto';
import License, { LicenseAttributes } from '../../database/models/license.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { PaginationResult, SearchCondition } from '../../database/models/base.model';

export default class LicenseService {
  constructor() {}

  async getById(id: number): Promise<LicenseAttributes> {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    return license.toJSON();
  }

  async create(data: CreateLisenceDto): Promise<LicenseAttributes> {
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
    return license.toJSON();
  }

  async deleteById(id: number): Promise<null> {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    await license.destroy();
    return null;
  }

  async updateById(id: number, data: Partial<CreateLisenceDto>): Promise<LicenseAttributes> {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    await license.update(data);
    return license.toJSON();
  }

  async getAll(input: {
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: any;
  }): Promise<PaginationResult<LicenseAttributes>> {
    const results = await License.paginate<LicenseAttributes>({
      PerPage: input.perPage,
      page: input.page,
      searchConditions: input.searchConditions || [],
      sortOptions: input.sortOptions,
    });

    return results;
  }
}
