import express, { Router } from 'express';
import AuthMiddleware from './middleware/auth.middleware';
import userRouter from './routes/user/user.route';
import MainRouter from './routes';
import AuthRoute from './routes/auth/auth.route';
import LicenseRoute from './routes/lisence/lisence.route';
import { jwtMiddleware } from './middleware/jwt.middleware';

export class Routes {
  constructor(private expressInstance: express.Express) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register main routes
    this.expressInstance.use('/', new MainRouter().router);
    this.expressInstance.use('/api/users', new userRouter().router);
    this.expressInstance.use('/api/auth', new AuthRoute().router);
    this.expressInstance.use('/api/licenses', jwtMiddleware(), new LicenseRoute().router);
  }
}
