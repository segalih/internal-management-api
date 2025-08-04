import _ from 'lodash';

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