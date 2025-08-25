import License, { LicenseAttributes } from '@database/models/license.model';
import { healthchecksResource } from './healthchecks.resource';

export const licenseResource = (data: License): LicenseAttributes => {
  return {
    id: data.id,
    pks: data.pks,
    application: data.application,
    dueDateLicense: data.dueDateLicense,
    filePks: data.filePks,
    fileBast: data.fileBast,
    isNotified: data.isNotified,
    healthchecks: data.healthchecks && data.healthchecks.map((healthcheck) => healthchecksResource(healthcheck)),
  };
};
