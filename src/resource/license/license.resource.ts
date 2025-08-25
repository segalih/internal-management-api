import License, { LicenseAttributes } from '@database/models/license.model';
import { healthchecksResource } from './healthchecks.resource';
import { DateTime } from 'luxon';

export const licenseResource = (data: License): LicenseAttributes => {
  const dueDate = DateTime.fromISO(data.dueDateLicense.toString(), { zone: 'UTC' });
  const dayTodaytoDueDate = dueDate.diffNow('days').days;
  let colorStatus = 'green';
  if (dayTodaytoDueDate < 30) {
    colorStatus = 'red';
  } else if (dayTodaytoDueDate < 90) {
    colorStatus = 'yellow';
  }
  return {
    id: data.id,
    pks: data.pks,
    application: data.application,
    dueDateLicense: data.dueDateLicense,
    filePks: data.filePks,
    fileBast: data.fileBast,
    isNotified: data.isNotified,
    status: colorStatus,
    healthchecks: data.healthchecks && data.healthchecks.map((healthcheck) => healthchecksResource(healthcheck)),
  };
};
