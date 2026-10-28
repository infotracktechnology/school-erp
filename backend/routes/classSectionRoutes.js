import { Router } from 'express';
import { classSectionController } from '../controllers/classSectionController.js';

export const classSectionRouter = Router();

classSectionRouter.get('/', classSectionController.list);
classSectionRouter.post('/save-matrix', classSectionController.saveMatrix);
classSectionRouter.put('/classes/:classId', classSectionController.saveClassMappings);

export default classSectionRouter;
