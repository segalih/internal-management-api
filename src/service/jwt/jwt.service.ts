import * as jwt from 'jsonwebtoken';
import configConstants from '../../config/constants';
import { ForbiddenException } from '../../helper/Error/Forbidden/ForbiddenException';

export default class JWTService {
  async generateToken(userPayload: any) {
    return jwt.sign(userPayload, configConstants.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: configConstants.JWT_EXPIRES_IN,
    });
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, configConstants.JWT_SECRET_ACCESS_TOKEN);
    } catch (error) {
      throw new ForbiddenException('Invalid token', {});
    }
  }
}
