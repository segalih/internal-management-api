import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpStatusCode } from 'axios';
import { ResponseApi } from '@helper/interface/response.interface';
import { messages } from '@config/message';

function flattenErrors(errors: ValidationError[], parent?: string): any[] {
  return errors.flatMap((error) => {
    const propertyPath = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      return [
        {
          property: propertyPath,
          constraints: error.constraints,
        },
      ];
    }

    if (error.children && error.children.length > 0) {
      return flattenErrors(error.children, propertyPath);
    }

    return [];
  });
}

export function validationMiddleware<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors: ValidationError[] = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const flatErrors = flattenErrors(errors);

      const errorResponse: ResponseApi<any> = {
        statusCode: HttpStatusCode.BadRequest,
        message: messages.VALIDATION_ERROR,
        data: {},
        errors: flatErrors,
      };

      if (req.file) {
        const fs = require('fs');
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(HttpStatusCode.BadRequest).json(errorResponse);
    }

    next();
  };
}
