import { Sequelize } from 'sequelize';
import PersonInCharge from '@database/models/person_in_charge.model';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { PersonInChargeService } from '../personInCharge.service';

describe('PersonInChargeService (Integration)', () => {
  let service: PersonInChargeService;

  beforeAll(async () => {});

  beforeEach(async () => {
    service = new PersonInChargeService();
    await PersonInCharge.destroy({ where: {} });
  });

  describe('getById', () => {
    it('should return person in charge if exists', async () => {
      const created = await PersonInCharge.create({
        personName: 'John Doe',
        flag: true,
      });

      const found = await service.getById(created.id);

      expect(found).toBeDefined();
      expect(found.personName).toBe('John Doe');
      expect(found.flag).toBe(true);
    });

    it('should throw NotFoundException if not exists', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchAll', () => {
    it('should return all person in charge records', async () => {
      await PersonInCharge.bulkCreate([
        { personName: 'Alice', flag: true },
        { personName: 'Bob', flag: false },
      ]);

      const result = await service.fetchAll();

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.personName)).toContain('Alice');
      expect(result.map((r) => r.personName)).toContain('Bob');
    });

    it('should return empty array if no records', async () => {
      const result = await service.fetchAll();
      expect(result).toEqual([]);
    });
  });
});
