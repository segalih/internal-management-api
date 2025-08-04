import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpStatusCode } from 'axios';
import { ResponseApi } from '../helper/interface/response.interface';
import { messages } from '../config/message';

export function validationMiddleware<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const errorResponse: ResponseApi<any> = {
        statusCode: HttpStatusCode.BadRequest,
        message: messages.VALIDATION_ERROR,
        data: {},
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      };

      if (req.file) {
        const fs = require('fs');
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(HttpStatusCode.BadRequest).json({
        ...errorResponse,
      });
    }

    next();
  };
}
