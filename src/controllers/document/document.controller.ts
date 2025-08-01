import { Request, Response } from 'express';
import { ProcessError } from '../../helper/Error/errorHandler';
import { DocumentService } from '../../service/document/document.service';
import { isStringNumber } from '../../helper/function/common';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import fs from 'fs';
import path from 'path';
export class DocumentController {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }

  async getDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isStringNumber(id)) {
      throw new BadRequestException('Invalid document ID format');
    }
    try {
      const document = await this.documentService.getDocumentById(Number(id));

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const absolutePath = path.resolve(document.path);
      console.log('Document absolute path:', absolutePath);

      if (!fs.existsSync(`.${absolutePath}`)) {
        return ProcessError(new NotFoundException('Document file not found'), res);
      }

      res.download(`.${absolutePath}`, document.filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          return ProcessError(new NotFoundException('Error downloading document'), res);
        }
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
