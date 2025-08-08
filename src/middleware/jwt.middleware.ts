import { NextFunction, Request, Response } from 'express';
import { ResponseApi } from '../helper/interface/response.interface';
import { HttpStatusCode } from 'axios';
import { messages } from '../config/message';
import jwt from 'jsonwebtoken';
import configConstants from '../config/constants';

export function jwtMiddleware() {
  return async (req: Request, res: Response<ResponseApi<null>>, next: NextFunction) => {
    try {
      const pathUrl = req.originalUrl;

      const whiteListPattern = [`/api/msa/file/\\d+`];
      if (whiteListPattern.some((pattern) => new RegExp(pattern).test(pathUrl))) {
        return next();
      }

      if (!req.headers['authorization']) {
        throw new Error();
      }

      const buffer = req.headers['authorization'].split(' ');
      const token = buffer[1];

      if (buffer[0] != 'Bearer' && !token) {
        throw new Error();
      }
      jwt.verify(token, configConstants.JWT_SECRET_ACCESS_TOKEN);
      // @ts-ignore
      req.user = jwt.decode(token) as any;
      next();
    } catch (error) {
      return res.status(HttpStatusCode.Unauthorized).json({
        statusCode: HttpStatusCode.Unauthorized,
        message: messages.UNAUTHORIZED,
        data: null,
      });
    }
  };
}
