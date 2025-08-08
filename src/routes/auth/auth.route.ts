import { Request, Response, Router } from 'express';
import { LoginDto } from '@common/dto/auth/login.dto';
import { UserController } from '@controllers/user/user.controller';
import { validationMiddleware } from '@middleware/validation.middleware';

export default class AuthRoute {
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
      .post(validationMiddleware(LoginDto), (req: Request, res: Response) => this.userController.signIn(req, res));
  }
}
