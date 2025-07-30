import express from 'express';
import { jwtMiddleware } from './middleware/jwt.middleware';
import MainRouter from './routes';
import AuthRoute from './routes/auth/auth.route';
import LicenseRoute from './routes/license/license.route';
import userRouter from './routes/user/user.route';
import MsaRoute from './routes/msa/msa.route';

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
    this.expressInstance.use('/api/msa', jwtMiddleware(), new MsaRoute().router);
  }
}
