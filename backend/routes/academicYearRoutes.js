import { Router } from 'express';
import { academicYearController } from '../controllers/academicYearController.js';

export const academicYearRouter = Router();

academicYearRouter.get('/next-year/info', academicYearController.getNextAcademicYear);
academicYearRouter.get('/', academicYearController.list);
academicYearRouter.get('/:id', academicYearController.getById);
academicYearRouter.post('/', academicYearController.create);
academicYearRouter.put('/:id', academicYearController.update);
academicYearRouter.patch('/:id/status', academicYearController.updateStatus);
academicYearRouter.patch('/:id/set-current', academicYearController.setCurrent);
academicYearRouter.patch('/:id/set-next', academicYearController.setNext);
academicYearRouter.patch('/:id/toggle-enabled', academicYearController.toggleEnabled);

export default academicYearRouter;
