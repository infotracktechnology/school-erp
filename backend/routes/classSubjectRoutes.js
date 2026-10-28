import { Router } from 'express';
import { classSubjectController } from '../controllers/classSubjectController.js';

export const classSubjectRouter = Router();

classSubjectRouter.get('/', classSubjectController.list);
classSubjectRouter.post('/', classSubjectController.create);
classSubjectRouter.post('/copy', classSubjectController.copy);
classSubjectRouter.post('/assign', classSubjectController.assign);
classSubjectRouter.put('/:id', classSubjectController.update);
classSubjectRouter.patch('/:id/status', classSubjectController.updateStatus);
classSubjectRouter.delete('/:id', classSubjectController.delete);

export default classSubjectRouter;
