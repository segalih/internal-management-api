import { Router } from 'express';
import { MsaV2Controller } from '../../../controllers/v2/msa/msav2.controller';
import { validationMiddleware } from '../../../middleware/validation.middleware';
import { MsaDetailV2Controller } from '../../../controllers/v2/msa/msaDetailV2.controller';
import { CreateMsaV2Dto } from '../../../common/dto/v2/msaV2/createMsaV2Dto';
import CreateMsaDetaiV2lDto from '../../../common/dto/v2/msaV2/CreateMsaDetailV2Dto';

export default class MsaV2Route {
  router: Router;
  private MsaV2Controller: MsaV2Controller;
  private msaDetailV2Controller: MsaDetailV2Controller;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.MsaV2Controller = new MsaV2Controller();
    this.msaDetailV2Controller = new MsaDetailV2Controller();
    this.serve();
  }

  serve() {
    this.router
      .route('/')
      .post(validationMiddleware(CreateMsaV2Dto), (req, res) => this.MsaV2Controller.create(req, res))
      .get((req, res) => this.MsaV2Controller.index(req, res));
    // this.router
    //   .route('/:id/detail')
    //   .post(validationMiddleware(CreateMsaDetaiV2lDto), (req, res) => this.msaDetailV2Controller.create(req, res));
    // this.router
    //   .route('/:id/detail/:msaDetailId')
    //   .put(validationMiddleware(CreateMsaDetaiV2lDto), (req, res) => this.msaDetailV2Controller.update(req, res))
    //   .delete((req, res) => this.msaDetailV2Controller.destroy(req, res));

    this.router
      .route('/:id')
      .get((req, res) => this.MsaV2Controller.show(req, res))
      .delete((req, res) => this.MsaV2Controller.destroy(req, res));
    //   .put(validationMiddleware(CreateMsaV2Dto), (req, res) => this.MsaV2Controller.update(req, res));
  }
}
