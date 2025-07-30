import { Router } from 'express';
import { validationMiddleware } from '../../middleware/validation.middleware';
import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import { MsaController } from '../../controllers/msa/msa.controller';

export default class MsaRoute {
  router: Router;
  private msaController: MsaController; // Replace with actual controller type

  constructor() {
    this.router = Router({ mergeParams: true });
    this.msaController = new MsaController(); // Initialize with actual controller instance
    this.serve();
  }

  serve() {
    this.router.route('/').post(validationMiddleware(CreateMsaDto), (req, res) => this.msaController.create(req, res));
    //   .get((req, res) => this.msaController.index(req, res));
    // this.router
    //   .route('/:id')
    //   .get((req, res) => this.msaController.show(req, res))
    //   .delete((req, res) => this.msaController.destroy(req, res))
    //   .put(validationMiddleware(CreateMsaDto), (req, res) => this.msaController.update(req, res));
  }
}
