import { ProcessError } from '@helper/Error/errorHandler';
import { UnauthorizedException } from '@helper/Error/UnauthorizedException/UnauthorizedException';
import { IUser } from '@helper/interface/user/user.interface';
import JWTService from '@service/jwt/jwt.service';
import { NextFunction, Request, Response } from 'express';
import logger from '@helper/logger';

interface ISpecifiedRoute {
  route: RegExp;
  method: string;
}
export default class AuthMiddleware {
  public async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bypasAuth = ['/api/common', '/api/auth', '/api/store'];
      for (const whitelist of bypasAuth) {
        if (req.path.startsWith(whitelist)) {
          return next();
        }
      }
      if (req.path === '/' || req.path === '/api' || req.path === '/favicon.ico') {
        return next();
      }

      if (!req.headers.authorization) throw new UnauthorizedException('Unauthorized', {});
      const jwtService = new JWTService();

      const token = req.headers.authorization.split(' ')[1];
      const decoded = await jwtService.verifyToken(token);
      req.user = decoded as IUser;
      next();
    } catch (error) {
      logger.error('JWT Middleware Error:', error);
      ProcessError(error, res);
    }
  }
}
