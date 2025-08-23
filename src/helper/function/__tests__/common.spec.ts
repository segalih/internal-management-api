import { isStringNumber, rupiahFormatter, getDiffMonths, stringToDate, dateToIsoString } from '../common';
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';

describe('common functions', () => {
  describe('isStringNumber', () => {
    it('should return true for numeric strings', () => {
      expect(isStringNumber('123')).toBe(true);
      expect(isStringNumber('0')).toBe(true);
      expect(isStringNumber('12.34')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isStringNumber('abc')).toBe(false);
      expect(isStringNumber('')).toBe(false);
      expect(isStringNumber(null)).toBe(false);
      expect(isStringNumber(undefined)).toBe(false);
    });

    it('should return false for numbers (not string)', () => {
      expect(isStringNumber(123)).toBe(false);
    });
  });

  describe('rupiahFormatter', () => {
    it('should format numbers to IDR currency', () => {
      expect(rupiahFormatter(1000)).toBe('Rp1.000');
      expect(rupiahFormatter(123456789)).toBe('Rp123.456.789');
    });
  });

  describe('getDiffMonths', () => {
    it('should return the correct month difference rounded up', () => {
      expect(getDiffMonths('2025-01-01', '2025-02-01')).toBe(1);
      expect(getDiffMonths('2025-01-01', '2025-02-15')).toBe(2);
    });
  });

  describe('stringToDate', () => {
    it('should convert ISO string to Date object', () => {
      const date = stringToDate('2025-01-01T00:00:00Z');
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe('2025-01-01T00:00:00.000Z');
    });
  });

  describe('dateToIsoString', () => {
    it('should convert Date object to ISO string', () => {
      const iso = dateToIsoString(new Date('2025-01-01T00:00:00Z'));
      expect(iso).toBe('2025-01-01T00:00:00.000Z');
    });

    it('should throw BadRequestException for invalid date', () => {
      expect(() => dateToIsoString(new Date('invalid'))).toThrow(BadRequestException);
    });
  });
});
