import PersonInCharge from '../../database/models/person_in_charge.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export class PersonInChargeService {
  constructor() {}

  async getById(id: number): Promise<PersonInCharge> {
    const personInCharge = await PersonInCharge.findByPk(id);

    if (!personInCharge) {
      throw new NotFoundException('Person in charge not found', { id });
    }

    return personInCharge;
  }

  async fetchAll(): Promise<PersonInCharge[]> {
    const personInCharges = await PersonInCharge.findAll();

    if (personInCharges.length === 0) {
      throw new NotFoundException('No person in charge found');
    }

    return personInCharges;
  }
}
