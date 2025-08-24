import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import LicenseService from '../license.service';

describe('LicenseService', () => {
  let service: LicenseService;

  beforeEach(() => {
    service = new LicenseService();
  });

  describe('create', () => {
    it('should create a license successfully', async () => {
      const dto = {
        pks: 'PKS-123',
        application: 'MyApp',
        due_date_license: '2030-12-31',
        file_pks: 'pks.pdf',
        file_bast: 'bast.pdf',
        is_notified: true,
      };

      const license = await service.create(dto as any);
      expect(license).toBeDefined();
      expect(license.pks).toBe('PKS-123');
    });
  });

  describe('getById', () => {
    it('should throw NotFoundException if license not exists', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });

    it('should return license if exists', async () => {
      const dto = {
        pks: 'PKS-456',
        application: 'TestApp',
        due_date_license: '2031-01-01',
        file_pks: 'file.pdf',
        file_bast: 'bast.pdf',
        is_notified: true,
      };

      const created = await service.create(dto as any);
      const found = await service.getById(created.id);

      expect(found).toBeDefined();
      expect(found.pks).toBe('PKS-456');
    });
  });

  describe('updateById', () => {
    it('should update license successfully', async () => {
      const dto = {
        pks: 'PKS-789',
        application: 'UpdateApp',
        due_date_license: '2032-05-05',
        file_pks: 'update.pdf',
        file_bast: 'bast_update.pdf',
        is_notified: true,
      };

      const created = await service.create(dto as any);

      const updated = await service.updateById(created.id, {
        application: 'UpdatedAppName',
        due_date_license: '2033-01-01',
        file_pks: 'new.pdf',
        file_bast: 'new_bast.pdf',
      });

      expect(updated.application).toBe('UpdatedAppName');
    });
  });

  describe('deleteById', () => {
    it('should delete license successfully', async () => {
      const dto = {
        pks: 'PKS-999',
        application: 'DeleteApp',
        due_date_license: '2035-10-10',
        file_pks: 'del.pdf',
        file_bast: 'del_bast.pdf',
        is_notified: true,
      };

      const created = await service.create(dto as any);

      await expect(service.deleteById(created.id)).resolves.toBeNull();
      await expect(service.getById(created.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('licenseResponse', () => {
    it('should return license with status color', async () => {
      const dto = {
        pks: 'PKS-321',
        application: 'RespApp',
        due_date_license: '2100-01-01',
        file_pks: 'file.pdf',
        file_bast: 'file.pdf',
        is_notified: true,
      };

      const created = await service.create(dto as any);
      const response = service.licenseResponse(created);

      expect(response).toHaveProperty('status');
      expect(['green', 'yellow', 'red']).toContain(response.status);
    });
  });
});
