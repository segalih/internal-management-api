import LicenseHealthcheck from '@database/models/license_healthcheck.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { LicenseHealcheckService } from '../licenseHealtheck.service';

describe('LicenseHealcheckService', () => {
  let service: LicenseHealcheckService;

  beforeEach(() => {
    service = new LicenseHealcheckService();
  });

  describe('getById', () => {
    it('should throw NotFoundException if licenseHealthcheck not exists', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });

    it('should return licenseHealthcheck if exists', async () => {
      const hc = await LicenseHealthcheck.create({
        licenseId: 1,
        healthcheckRoutineDate: new Date(),
      });

      const found = await service.getById(hc.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(hc.id);
      expect(found.licenseId).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a licenseHealthcheck successfully with actual date', async () => {
      const dto = {
        healthcheck_routine_date: '2025-08-23',
        healthcheck_actual_date: '2025-08-24',
      };

      const hc = await service.create(1, dto as any);
      expect(hc).toBeDefined();
      expect(hc.licenseId).toBe(1);
      expect(hc.healthcheckRoutineDate.toISOString().slice(0, 10)).toBe('2025-08-23');
      expect(hc.healthcheckActualDate?.toISOString().slice(0, 10)).toBe('2025-08-24');
    });

    it('should create a licenseHealthcheck successfully without actual date', async () => {
      const dto = {
        healthcheck_routine_date: '2025-08-25',
        healthcheck_actual_date: undefined,
      };

      const hc = await service.create(2, dto as any);
      expect(hc).toBeDefined();
      expect(hc.licenseId).toBe(2);
      expect(hc.healthcheckRoutineDate.toISOString().slice(0, 10)).toBe('2025-08-25');
      expect(hc.healthcheckActualDate).toBeUndefined();
    });
  });
});
