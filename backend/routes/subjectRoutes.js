import { Router } from 'express';
import { subjectController } from '../controllers/subjectController.js';

export const subjectRouter = Router();

subjectRouter.get('/', subjectController.list);
subjectRouter.get('/:id', subjectController.getById);
subjectRouter.post('/', subjectController.create);
subjectRouter.put('/:id', subjectController.update);
subjectRouter.patch('/:id/status', subjectController.updateStatus);

export default subjectRouter;
