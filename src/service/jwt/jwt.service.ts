import * as jwt from 'jsonwebtoken';
import configConstants from '@config/constants';
import { ForbiddenException } from '@helper/Error/Forbidden/ForbiddenException';

export default class JWTService {
  async generateToken(userPayload: object) {
    const secret: jwt.Secret = configConstants.JWT_SECRET_ACCESS_TOKEN;
    const options: jwt.SignOptions = {
      expiresIn: '1d',
    };
    return jwt.sign(userPayload, secret, options);
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, configConstants.JWT_SECRET_ACCESS_TOKEN);
    } catch (error) {
      throw new ForbiddenException('Invalid token', {});
    }
  }
}
