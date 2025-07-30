import _ from 'lodash';

export function isStringNumber(value: any): boolean {
  return _.isString(value) && _.isFinite(_.toNumber(value));
}
