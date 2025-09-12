import License, { LicenseAttributes } from '@database/models/license.model';
import { healthchecksResource } from './healthchecks.resource';
import { DateTime } from 'luxon';
import { dateToIsoString } from '@helper/function/common';
import { masterVendorApplicationResource } from '@resource/master/vendor_application.resource';

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
    vendor_id: data.vendor_id,
    descriptions: data.descriptions,
    filePks: data.filePks,
    fileBast: data.fileBast,
    isNotified: data.isNotified,
    status: colorStatus,
    vendor: data.vendorApplication ? masterVendorApplicationResource(data.vendorApplication) : undefined,
    healthchecks: data.healthchecks && data.healthchecks.map((healthcheck) => healthchecksResource(healthcheck)),
  };
};
