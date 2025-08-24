import Status from '@database/models/status.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { StatusMasterService } from '../statusMaster.service';

describe('StatusMasterService (Integration)', () => {
  let service: StatusMasterService;

  beforeEach(async () => {
    service = new StatusMasterService();
    // Kosongkan tabel sebelum tiap test biar fresh
    await Status.destroy({ where: {} });
  });

  describe('getById', () => {
    it('should return status if exists', async () => {
      const created = await Status.create({
        statusName: 'ACTIVE',
        flag: true,
      });

      const found = await service.getById(created.id);

      expect(found).toBeDefined();
      expect(found.statusName).toBe('ACTIVE');
      expect(found.flag).toBe(true);
    });

    it('should throw NotFoundException if not exists', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchAll', () => {
    it('should return all statuses', async () => {
      await Status.bulkCreate([
        { statusName: 'ACTIVE', flag: true },
        { statusName: 'INACTIVE', flag: false },
      ]);

      const result = await service.fetchAll();

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.statusName)).toContain('ACTIVE');
      expect(result.map((r) => r.statusName)).toContain('INACTIVE');
    });

    it('should return empty array if no statuses found', async () => {
      const result = await service.fetchAll();
      expect(result).toEqual([]);
    });
  });
});
