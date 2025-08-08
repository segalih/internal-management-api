import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ProcessError } from '@helper/Error/errorHandler';
import { NotFoundException } from '@helper/Error/NotFound/NotFoundException';
import { DocumentService } from '@service/document/document.service';
export class DocumentController {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }

  async getDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const decodedBase64Id = Buffer.from(id, 'base64').toString('utf-8');
    try {
      const document = await this.documentService.getDocumentById(decodedBase64Id);

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const absolutePath = path.resolve(document.path);

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
