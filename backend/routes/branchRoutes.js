import { Router } from 'express';
import { branchController } from '../controllers/branchController.js';

export const branchRouter = Router();

branchRouter.get('/', branchController.list);
branchRouter.get('/:id', branchController.getById);
branchRouter.post('/', branchController.create);
branchRouter.put('/:id', branchController.update);
branchRouter.patch('/:id/status', branchController.updateStatus);
branchRouter.delete('/:id', branchController.delete);
