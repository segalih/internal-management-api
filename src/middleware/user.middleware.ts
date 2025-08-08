import { IResponse } from '@controllers/interface';
import { UserAttributes } from '@database/models/user.model';
import { NextFunction, Request, Response } from 'express';

export default class UserMiddleware {
  static async userExistValidation(req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) {
    // try {
    //   const userService = new UserService();
    //   const body: IUserBodyReq = req.body.email;
    //   const user = await userService.findOne({ email: body.email });
    //   if (user) {
    //     res.status(HttpStatusCode.BadRequest).send({
    //       statusCode: HttpStatusCode.BadRequest,
    //       message: 'User with this email is already exist',
    //     });
    //   } else {
    //     return next();
    //   }
    // } catch (e: any) {
    //   if (e instanceof NotFoundException) {
    //     return next();
    //   } else {
    //     res.status(HttpStatusCode.InternalServerError).send({
    //       statusCode: HttpStatusCode.InternalServerError,
    //       message: 'Server Error',
    //     });
    //   }
    // }
  }

  static isCreateAdmin() {
    // return (req: Request, res: Response, next: NextFunction) => {
    //   if (!req.body.branch_id) {
    //     return next();
    //   }
    //   res.redirect('/api/users/admin');
    // };
  }
}
