import { Router } from 'express';
import { DocumentController } from '../../controllers/document/document.controller';

export default class DocumentRouter {
  router: Router;
  private documentController: DocumentController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.documentController = new DocumentController();
    this.serve();
  }

  serve() {
    this.router.route('/:id').get((req, res) => this.documentController.getDocument(req, res));
  }
}
