import _ from 'lodash';
import { DateTime } from 'luxon';

export function isStringNumber(value: any): boolean {
  return _.isString(value) && _.isFinite(_.toNumber(value));
}

export function rupiahFormatter(value: number): string {
  if (value === null || value === undefined) {
    return '';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export const getDiffMonths = (dateStarted: string, dateEnded: string): number => {
  return Math.ceil(DateTime.fromISO(dateEnded).diff(DateTime.fromISO(dateStarted), 'months').months);
};