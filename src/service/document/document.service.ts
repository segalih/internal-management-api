import Document, { DocumentCreationAttributes } from '../../database/models/document.model';
import fs from 'fs';
import path from 'path';
import logger from '../../logger';
export class DocumentService {
  constructor() {}

  async saveDocument(data: DocumentCreationAttributes): Promise<Document> {
    try {
      const document = await Document.create(data);

      const rootPath = path.resolve(__dirname, '../../../');

      const oldPath = path.join(rootPath, 'uploads/tmp', data.filename);

      const newPath = path.join(rootPath, data.path); // data.path must be relative from uploads

      const targetDir = path.dirname(newPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        return document;
      } else {
        throw new Error(`File not found: ${oldPath}`);
      }
    } catch (error) {
      logger.error('Error saving document:', error);
      throw new Error('Failed to save document');
    }
  }

  async getDocumentById(id: number): Promise<Document | null> {
    return await Document.findByPk(id);
  }
}
