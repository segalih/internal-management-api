import { Router } from 'express';
import { LicenseController } from '../../controllers/license/license.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { CreateLisenceDto } from '../../common/dto/lisence/CreateLisenceDto';

export default class LicenseRoute {
  router: Router;
  private licenseController: LicenseController; // Replace with actual controller type
  constructor() {
    this.router = Router({ mergeParams: true });
    this.licenseController = new LicenseController(); // Initialize with actual controller instance
    this.serve();
  }

  serve() {
    this.router
      .route('/')
      .post(validationMiddleware(CreateLisenceDto), (req, res) => this.licenseController.create(req, res));
  }
}
