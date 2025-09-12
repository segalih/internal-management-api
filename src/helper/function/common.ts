import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import _ from 'lodash';
import { DateTime } from 'luxon';

export function isStringNumber(value: any): boolean {
  if (typeof value !== 'string') return false;
  if (value === '') return false;

  return _.isString(value) && _.isFinite(_.toNumber(value));
}

export function rupiahFormatter(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export const getDiffMonths = (dateStarted: string, dateEnded: string): number => {
  const diff = DateTime.fromISO(dateEnded, { zone: 'UTC' }).diff(
    DateTime.fromISO(dateStarted, { zone: 'UTC' }),
    'months'
  );
  return Math.ceil(diff.months);
};

export const stringToDate = (date: string): Date => DateTime.fromISO(date, { zone: 'UTC' }).toJSDate();
export const dateToIsoString = (date: Date): string => {
  const result = DateTime.fromJSDate(date, { zone: 'UTC' }).toISO();
  if (!result) {
    throw new BadRequestException('Invalid date format - dateToIsoString');
  }
  return result;
};
