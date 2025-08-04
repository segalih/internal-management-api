import { Op } from 'sequelize';
import { CreateLisenceDto } from '../../common/dto/lisence/CreateLisenceDto';
import License, { LicenseAttributes } from '../../database/models/license.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { PaginationResult, SearchCondition } from '../../database/models/base.model';
import { encrypt } from '../../helper/function/crypto';
import { DateTime } from 'luxon';

export default class LicenseService {
  constructor() {}

  async getById(id: number): Promise<License> {
    const license = await License.findByPk(id, {});
    if (!license) {
      throw new NotFoundException('License not found');
    }
    return license;
  }

  async create(data: CreateLisenceDto): Promise<License> {
    const license = await License.create({
      pks: data.pks,
      application: data.application,
      dueDateLicense: data.due_date_license,
      healthCheckRoutine: data.health_check_routine,
      healthCheckActual: data.health_check_actual,
    });
    if (!license) {
      throw new NotFoundException('License not created');
    }
    return license;
  }

  async deleteById(id: number): Promise<null> {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    await license.destroy();
    return null;
  }

  async updateById(
    id: number,
    data: Partial<CreateLisenceDto>,
    filePksId?: number,
    fileBastId?: number
  ): Promise<License> {
    const license = await License.findByPk(id);
    if (!license) {
      throw new NotFoundException('License not found');
    }
    await license.update({
      pks: data.pks,
      application: data.application,
      dueDateLicense: data.due_date_license,
      healthCheckRoutine: data.health_check_routine,
      healthCheckActual: data.health_check_actual,
      pksFileId: filePksId ? filePksId : license.pksFileId,
      bastFileId: fileBastId ? fileBastId : license.bastFileId,
    });
    return license;
  }

  async getAll(input: {
    perPage: number;
    page: number;
    searchConditions?: SearchCondition[];
    sortOptions?: any;
  }): Promise<PaginationResult<License>> {
    const results = await License.paginate<License>({
      PerPage: input.perPage,
      page: input.page,
      searchConditions: input.searchConditions || [],
      sortOptions: input.sortOptions,
    });

    return results;
  }

  licenseResponse(license: License): LicenseAttributes {
    const pksFileBase64 = Buffer.from(license.pksFileId?.toString() || '').toString('base64');
    const bastFileBase64 = Buffer.from(license.bastFileId?.toString() || '').toString('base64');
    const dueDate = DateTime.fromISO(license.dueDateLicense.toString());
    console.log(`due date ${dueDate}`);
    const dayTodaytoDueDate = dueDate.diffNow('days').days;
    console.log('dayTodaytoDueDate', dayTodaytoDueDate);
    let colorStatus = 'green';
    if (dayTodaytoDueDate < 30) {
      colorStatus = 'red';
    } else if (dayTodaytoDueDate < 90) {
      colorStatus = 'yellow';
    }
    return {
      ...license.toJSON(),
      pksFileUrl: `/api/document/${pksFileBase64}`,
      bastFileUrl: `/api/document/${bastFileBase64}`,
      pks_file_id: undefined,
      bast_file_id: undefined,
      status: colorStatus,
    };
  }
}
