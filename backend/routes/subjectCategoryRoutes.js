import { Router } from 'express';
import { subjectCategoryController } from '../controllers/subjectCategoryController.js';

export const subjectCategoryRouter = Router();

subjectCategoryRouter.get('/', subjectCategoryController.list);
subjectCategoryRouter.post('/', subjectCategoryController.create);
subjectCategoryRouter.patch('/:id/status', subjectCategoryController.updateStatus);

export default subjectCategoryRouter;
