import { Router } from 'express';
import { MasterController } from '../../controllers/master/master.controller';

export class MasterRouter {
  router: Router;
  private masterController: MasterController;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.masterController = new MasterController();
    this.serve();
  }

  serve() {
    this.router.route('/applications').get((req, res) => this.masterController.getAllApplications(req, res));
    this.router.route('/statuses').get((req, res) => this.masterController.getAllStatus(req, res));
    this.router.route('/person-in-charges').get((req, res) => this.masterController.getAllPersonInCharge(req, res));
  }
}
