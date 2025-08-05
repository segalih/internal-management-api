import IncidentLink from '../../database/models/incident_link.model';

export class IncidentLinkService {
  async deleteByIncidentId(id: number): Promise<void> {
    await IncidentLink.softDelete({ incidentId: id });
  }
}
