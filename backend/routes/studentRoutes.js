import { Router } from 'express';
import { studentController } from '../controllers/studentController.js';

export const studentRouter = Router();

studentRouter.get('/', studentController.list);
studentRouter.post('/bulk-update', studentController.bulkUpdate);
studentRouter.post('/bulk-class-section-change', studentController.bulkChangeClassSection);
studentRouter.get('/class-section-history', studentController.getClassSectionHistory);
studentRouter.post('/promote', studentController.promote);
studentRouter.get('/promotions-history', studentController.getPromotionHistory);
studentRouter.get('/section-subject-mapping', studentController.getSectionSubjectMapping);
studentRouter.post('/bulk-assign-subjects', studentController.bulkAssignSectionSubjects);
studentRouter.post('/bulk-credentials', studentController.bulkUpdateStudentCredentials);
studentRouter.put('/:id/credentials', studentController.updateStudentCredentials);
studentRouter.get('/:id', studentController.getById);
studentRouter.get('/:id/subjects', studentController.getStudentSubjects);
studentRouter.put('/:id/subjects', studentController.updateStudentSubjects);
studentRouter.post('/', studentController.create);
studentRouter.put('/:id', studentController.update);
studentRouter.post('/:id/fcm-token', studentController.saveFcmToken);
studentRouter.delete('/:id/fcm-token', studentController.deleteFcmToken);

export default studentRouter;
