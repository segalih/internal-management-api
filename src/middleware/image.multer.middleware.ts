import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { extname } from 'path';
import fs from 'fs';
import { ResponseApi } from '../helper/interface/response.interface';
import { messages } from '../config/message';

const uploadFolderPath = './uploads/';

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath);
}

const upload = multer({
  dest: uploadFolderPath,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolderPath);
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
      // const fileExtension = extname(file.originalname);
      cb(null, fileName); // Save with a random name and original extension
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error('Only image and pdf files are allowed!'));
    }
    cb(null, true);
  },
});

export function multerMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, function (error: any) {
    if (error) {
      const errorResponse: ResponseApi<null> = {
        statusCode: HttpStatusCode.BadRequest,
        message: messages.FAILED_UPLOAD,
        data: null,
        errors: error.message ?? 'An error occurred during file upload',
      };
      return res.status(HttpStatusCode.BadRequest).json({
        ...errorResponse,
      });
    }

    if (!req.file) {
      const errorResponse: ResponseApi<null> = {
        statusCode: HttpStatusCode.BadRequest,
        message: messages.FAILED_UPLOAD,
        data: null,
        errors: 'File is required',
      };
      return res.status(HttpStatusCode.BadRequest).json(errorResponse);
    }
    next();
  });
}
