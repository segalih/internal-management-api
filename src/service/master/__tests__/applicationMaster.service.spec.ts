import Application from '@database/models/application.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { ApplicationMasterService } from '../applicationMaster.service';

describe('ApplicationMasterService (Integration)', () => {
  let service: ApplicationMasterService;

  beforeEach(async () => {
    service = new ApplicationMasterService();
    // Bersihin tabel sebelum tiap test
    await Application.destroy({ where: {} });
  });

  describe('getById', () => {
    it('should return application if exists', async () => {
      const created = await Application.create({
        applicationName: 'TestApp',
        flag: true,
      });

      const found = await service.getById(created.id);

      expect(found).toBeDefined();
      expect(found.applicationName).toBe('TestApp');
    });

    it('should throw NotFoundException if not exists', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchAll', () => {
    it('should return all applications', async () => {
      await Application.bulkCreate([
        { applicationName: 'App1', flag: true },
        { applicationName: 'App2', flag: true },
      ]);

      const result = await service.fetchAll();

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.applicationName)).toContain('App1');
      expect(result.map((r) => r.applicationName)).toContain('App2');
    });

    it('should return empty array if no applications', async () => {
      const result = await service.fetchAll();
      expect(result).toEqual([]);
    });
  });
});
