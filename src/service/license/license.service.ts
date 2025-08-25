import { CreateLisenceDto } from '@common/dto/lisence/CreateLisenceDto';
import { PaginationResult, SearchCondition } from '@database/models/base.model';
import License, { LicenseAttributes } from '@database/models/license.model';
import LicenseHealthcheck from '@database/models/license_healthcheck.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { DateTime } from 'luxon';

export default class LicenseService {
  constructor() {}

  async getById(id: number): Promise<License> {
    const license = await License.findByPk(id, {
      include: [{ model: LicenseHealthcheck, as: 'healthchecks' }],
    });
    if (!license) {
      throw new NotFoundException('License not found');
    }
    return license;
  }

  async create(data: CreateLisenceDto): Promise<License> {
    const license = await License.create(
      {
        pks: data.pks,
        application: data.application,
        dueDateLicense: DateTime.fromISO(`${data.due_date_license}`, { zone: 'UTC' }).toJSDate(),
        // healthCheckRoutine: DateTime.fromISO(`${data.health_check_routine}`, { zone: 'UTC' }).toJSDate(),
        // healthCheckActual: DateTime.fromISO(`${data.health_check_actual}`, { zone: 'UTC' }).toJSDate(),
        filePks: data.file_pks,
        fileBast: data.file_bast,
        isNotified: data.is_notified ? data.is_notified : true,
        pksFileId: null,
        bastFileId: null,
      },
      {
        fields: ['pks', 'application', 'dueDateLicense', 'filePks', 'fileBast', 'isNotified'],
      }
    );
    license.save();
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
      dueDateLicense: DateTime.fromISO(`${data.due_date_license}`, { zone: 'UTC' }).toJSDate(),
      filePks: data.file_pks,
      fileBast: data.file_bast,
      isNotified: data.is_notified ? data.is_notified : true,
      pksFileId: null,
      bastFileId: null,
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
      includeConditions: [
        {
          model: LicenseHealthcheck,
          as: 'healthchecks',
        },
      ],
    });

    return results;
  }

  licenseResponse(license: License): LicenseAttributes {
    // const pksFileBase64 = Buffer.from(license.pksFileId?.toString() || '').toString('base64');
    // const bastFileBase64 = Buffer.from(license.bastFileId?.toString() || '').toString('base64');
    const dueDate = DateTime.fromISO(license.dueDateLicense.toString(), { zone: 'UTC' });
    const dayTodaytoDueDate = dueDate.diffNow('days').days;
    let colorStatus = 'green';
    if (dayTodaytoDueDate < 30) {
      colorStatus = 'red';
    } else if (dayTodaytoDueDate < 90) {
      colorStatus = 'yellow';
    }
    return {
      ...license.toJSON(),
      // pksFileUrl: `/api/document/${pksFileBase64}`,
      // bastFileUrl: `/api/document/${bastFileBase64}`,
      // pks_file_id: undefined,
      // bast_file_id: undefined,
      status: colorStatus,
      healthchecks: license.healthchecks,
    };
  }
}
