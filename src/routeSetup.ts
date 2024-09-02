import express, { Router } from 'express';
import AuthMiddleware from './middleware/auth.middleware';
import userRouter from './routes/user/user.route';
import MainRouter from './routes';
import AuthRoute from './routes/auth/auth.route';

export class Routes {
  private authMiddleware: AuthMiddleware;

  constructor(private expressInstance: express.Express) {
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const mainRouter = new MainRouter().router;
    const userRouterInstance = new userRouter().router;
    const authRouterInstance = new AuthRoute().router;

    // Register main routes
    this.expressInstance.use('/', mainRouter);
    // Apply authentication middleware
    // this.expressInstance.use(this.authMiddleware.checkAuth);
    // Register user routes under /api/users
    this.expressInstance.use('/api/users', userRouterInstance);
    this.expressInstance.use('/api/auth', authRouterInstance);
  }
}
