import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import { HttpStatusCode } from 'axios';
import { ResponseApi } from '../helper/interface/response.interface';
import { messages } from '../config/message';
import path from 'path';

const uploadFolderPath = './uploads/tmp';

// Create uploads folder if not exist
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath);
}

const baseUpload = multer({
  dest: uploadFolderPath,
  limits: {
    fileSize: 1024 * 1024 * 1, // 1MB
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolderPath);
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
      const extName = path.extname(file.originalname);
      cb(null, fileName + extName);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error('Only image and pdf files are allowed!'));
    }
    cb(null, true);
  },
});

/**
 * Flexible middleware to handle multiple named file uploads
 * @param fields array of field names (e.g., ['file_pks', 'file_bast'])
 * @returns Express middleware
 */
export function createFlexibleUploadMiddleware(fields: string[]) {
  const multerFields = fields.map((field) => ({ name: field, maxCount: 1 }));

  return function (req: Request, res: Response, next: NextFunction) {
    baseUpload.fields(multerFields)(req, res, function (error: any) {
      if (error) {
        const errorResponse: ResponseApi<null> = {
          statusCode: HttpStatusCode.BadRequest,
          message: messages.FAILED_UPLOAD,
          data: null,
          errors: error.message ?? 'An error occurred during file upload',
        };
        return res.status(HttpStatusCode.BadRequest).json(errorResponse);
      }
      next();
    });
  };
}

export const uploadForMSA = createFlexibleUploadMiddleware(['file_pks', 'file_bast']);
