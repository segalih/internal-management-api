import License, { LicenseAttributes } from '@database/models/license.model';
import { healthchecksResource } from './healthchecks.resource';
import { DateTime } from 'luxon';
import { dateToIsoString } from '@helper/function/common';

export const licenseResource = (data: License): LicenseAttributes => {
  const dueDate = DateTime.fromISO(dateToIsoString(data.dueDateLicense), { zone: 'UTC' });
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
    dateStarted: data.dateStarted,
    dueDateLicense: data.dueDateLicense,
    vendor: data.vendor,
    descriptions: data.descriptions,
    filePks: data.filePks,
    fileBast: data.fileBast,
    isNotified: data.isNotified,
    status: colorStatus,
    healthchecks: data.healthchecks && data.healthchecks.map((healthcheck) => healthchecksResource(healthcheck)),
  };
};
