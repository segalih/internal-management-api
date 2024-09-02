import { Request, Response, Router } from 'express';
import { UserController } from '../../controllers/user/user.controller';
import { validationMiddleware } from '../../middleware/validation.middleware';
import { CreateUserDto } from '../../common/dto/user/CreateUser.dto';

export default class userRouter {
  router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.userController = new UserController();
    this.serve();
  }

  serve() {
    this.router
      .route('/')
      .get((req: Request, res: Response) => this.userController.read(req, res))
      .post(validationMiddleware(CreateUserDto), (req: Request, res: Response) => this.userController.create(req, res));
  }
}
