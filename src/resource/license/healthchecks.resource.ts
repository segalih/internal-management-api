import LicenseHealthcheck, { LicenseHealthcheckAttributes } from '@database/models/license_healthcheck.model';

export const healthchecksResource = (
  data: LicenseHealthcheck | LicenseHealthcheckAttributes
): LicenseHealthcheckAttributes => {
  return {
    id: data.id,
    licenseId: data.licenseId,
    healthcheckRoutineDate: data.healthcheckRoutineDate,
    healthcheckActualDate: data.healthcheckActualDate,
  };
};
