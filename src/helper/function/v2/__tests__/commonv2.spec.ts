// src/helper/function/v2/__tests__/commonv2.spec.ts
import { BadRequestException } from '@helper/Error/BadRequestException/BadRequestException';
import { mapRolesToMsa, validateBudgetQuota, validateMsaJoinDates, validatePeopleQuota } from '../commonv2';
jest.useFakeTimers();

// Mock model Sequelize
jest.mock('@database/models/v2/v2_msa.model', () => {
  return {
    default: {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, roleId: 1, name: 'MSA 1' },
        { id: 2, roleId: 2, name: 'MSA 2' },
      ]),
    },
  };
});

jest.mock('@database/models/v2/v2_msa_has_roles.model', () => {
  return {
    default: {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, rate: 1000 },
        { id: 2, rate: 2000 },
      ]),
    },
  };
});

describe('commonv2 functions', () => {
  describe('validateMsaJoinDates', () => {
    it('should not throw error if join_date within range', () => {
      const msa = [{ join_date: '2025-01-05' }, { join_date: '2025-01-10' }] as any;
      expect(() => validateMsaJoinDates(msa, '2025-01-01', '2025-01-15')).not.toThrow();
    });

    it('should throw BadRequestException if join_date is out of range', () => {
      const msa = [{ join_date: '2024-12-31' }] as any;
      expect(() => validateMsaJoinDates(msa, '2025-01-01', '2025-01-31')).toThrow(BadRequestException);
    });
  });

  describe('validatePeopleQuota', () => {
    it('should not throw if total <= quota', () => {
      expect(() => validatePeopleQuota(5, 10)).not.toThrow();
    });

    it('should throw BadRequestException if total > quota', () => {
      expect(() => validatePeopleQuota(15, 10)).toThrow(BadRequestException);
    });
  });

  describe('mapRolesToMsa', () => {
    const roles = [{ id: 1, rate: 1000 } as any, { id: 2, rate: 2000 } as any];

    it('should map role correctly from CreateMsaDetailV2Dto', () => {
      const msa = [{ role_id: 1 } as any];
      const mapped = mapRolesToMsa(msa, roles);
      expect(mapped[0].id).toBe(1);
    });

    it('should throw BadRequestException if role not found', () => {
      const msa = [{ role_id: 999 } as any];
      expect(() => mapRolesToMsa(msa, roles)).toThrow(BadRequestException);
    });
  });

  describe('validateBudgetQuota', () => {
    const msa = [{ join_date: '2025-01-01', leave_date: '2025-03-01' } as any];
    const roles = [{ id: 1, rate: 1000 } as any];
    const pksDateEnded = '2025-12-31';

    it('should not throw if total budget <= quota', () => {
      expect(() => validateBudgetQuota(msa, roles, pksDateEnded, 5000)).not.toThrow();
    });

    it('should throw BadRequestException if total budget > quota', () => {
      expect(() => validateBudgetQuota(msa, roles, pksDateEnded, 1000)).toThrow(BadRequestException);
    });
  });
});
