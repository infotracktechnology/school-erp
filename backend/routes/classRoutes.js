import { Router } from 'express';
import { classController } from '../controllers/classController.js';

export const classRouter = Router();

classRouter.get('/', classController.list);
classRouter.patch('/academic-year-status', classController.toggleAcademicYearClass);
classRouter.patch('/academic-year-bulk-status', classController.bulkToggleAcademicYearClasses);
classRouter.get('/:id', classController.getById);
classRouter.post('/', classController.create);
classRouter.put('/:id', classController.update);
classRouter.patch('/:id/status', classController.updateStatus);

export default classRouter;
