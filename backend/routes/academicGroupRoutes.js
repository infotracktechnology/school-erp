import { Router } from 'express';
import { academicGroupController } from '../controllers/academicGroupController.js';

export const academicGroupRouter = Router();

academicGroupRouter.get('/', academicGroupController.list);
academicGroupRouter.post('/', academicGroupController.create);
academicGroupRouter.get('/:id', academicGroupController.getById);
academicGroupRouter.put('/:id', academicGroupController.update);
academicGroupRouter.patch('/:id/status', academicGroupController.updateStatus);
academicGroupRouter.delete('/:id', academicGroupController.delete);
academicGroupRouter.post('/:id/assign', academicGroupController.assignStudents);
academicGroupRouter.post('/:id/remove', academicGroupController.removeStudents);

export default academicGroupRouter;
