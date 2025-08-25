import { CreateHealthcheckDto } from '@common/dto/lisence/CreateHealthcheckDto';
import LicenseHealthcheck from '@database/models/license_healthcheck.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { stringToDate } from '@helper/function/common';
import { Transaction } from 'sequelize';

export class LicenseHealcheckService {
  async getById(id: number) {
    const licenseHealcheck = await LicenseHealthcheck.findByPk(id);

    if (!licenseHealcheck) {
      throw new NotFoundException('LicenseHealcheck not found');
    }

    return licenseHealcheck;
  }

  async create(licenseId: number, data: CreateHealthcheckDto, transaction?: Transaction): Promise<LicenseHealthcheck> {
    return await LicenseHealthcheck.create(
      {
        licenseId,
        healthcheckRoutineDate: stringToDate(data.healthcheck_routine_date),
        healthcheckActualDate: data.healthcheck_actual_date ? stringToDate(data.healthcheck_actual_date) : undefined,
      },
      { transaction }
    );
  }

  async deleteByLicenseId(licenseId: number, transaction?: Transaction): Promise<void> {
    await LicenseHealthcheck.destroy({ where: { licenseId }, transaction });
  }
}
