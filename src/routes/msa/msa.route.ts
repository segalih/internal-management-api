import { Router } from 'express';
import { validationMiddleware } from '../../middleware/validation.middleware';
import CreateMsaDto from '../../common/dto/msa/CreateMsaDto';
import { MsaController } from '../../controllers/msa/msa.controller';
import { multerMiddleware } from '../../middleware/image.multer.middleware';
import CreateMsaDetailDto from '../../common/dto/msa/CreateMsaDetailDto';
import { MsaDetailController } from '../../controllers/msa/msaDetail.controller';

export default class MsaRoute {
  router: Router;
  private msaController: MsaController;
  private msaDetailController: MsaDetailController; // Assuming you have a controller for MSA details

  constructor() {
    this.router = Router({ mergeParams: true });
    this.msaController = new MsaController();
    this.msaDetailController = new MsaDetailController();
    this.serve();
  }

  serve() {
    this.router
      .route('/')
      .post(multerMiddleware, validationMiddleware(CreateMsaDto), (req, res) => this.msaController.create(req, res));
    //   .get((req, res) => this.msaController.index(req, res));
    this.router.route('/file/:id').get((req, res) => this.msaController.getFile(req, res));

    this.router
      .route('/:id/detail')
      .post(validationMiddleware(CreateMsaDetailDto), (req, res) => this.msaDetailController.create(req, res));

    // this.router
    //   .route('/:id')
    //   .get((req, res) => this.msaController.show(req, res))
    //   .delete((req, res) => this.msaController.destroy(req, res))
    //   .put(validationMiddleware(CreateMsaDto), (req, res) => this.msaController.update(req, res));
  }
}
