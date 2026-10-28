import { Router } from 'express';
import { sectionController } from '../controllers/sectionController.js';

export const sectionRouter = Router();

sectionRouter.get('/', sectionController.list);
sectionRouter.get('/:id', sectionController.getById);
sectionRouter.post('/', sectionController.create);
sectionRouter.put('/:id', sectionController.update);
sectionRouter.patch('/:id/status', sectionController.updateStatus);
sectionRouter.delete('/:id', sectionController.delete);

export default sectionRouter;
