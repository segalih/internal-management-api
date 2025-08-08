import { Router } from 'express';
import { IncidentController } from '@controllers/incident/incident.controller';
import { validationMiddleware } from '@middleware/validation.middleware';
import { CreateIncidentDto } from '@common/dto/incident/CreateIncidentDto';

export class IncidentRouter {
  router: Router;
  private incidentController: IncidentController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.incidentController = new IncidentController();
    this.serve();
  }

  serve() {
    this.router
      .route('/')
      .post(validationMiddleware(CreateIncidentDto), (req, res) => this.incidentController.create(req, res))
      .get((req, res) => this.incidentController.index(req, res));
    this.router
      .route('/:id')
      .put(validationMiddleware(CreateIncidentDto), (req, res) => this.incidentController.update(req, res))
      .get((req, res) => this.incidentController.show(req, res))
      .delete((req, res) => this.incidentController.delete(req, res));
  }
}
