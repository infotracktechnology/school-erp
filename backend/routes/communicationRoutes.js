import { Router } from 'express';
import { communicationController } from '../controllers/communicationController.js';

export const communicationRouter = Router();

communicationRouter.get('/homework', communicationController.listHomework);
communicationRouter.post('/homework', communicationController.createHomework);
communicationRouter.put('/homework/:id', communicationController.updateHomework);
communicationRouter.delete('/homework/:id', communicationController.deleteHomework);
communicationRouter.post('/upload-attachment', communicationController.uploadAttachment);
communicationRouter.get('/announcements', communicationController.listAnnouncements);
communicationRouter.post('/announcements', communicationController.createAnnouncement);
communicationRouter.put('/announcements/:id', communicationController.updateAnnouncement);
communicationRouter.delete('/announcements/:id', communicationController.deleteAnnouncement);

// Assignments
communicationRouter.get('/assignments', communicationController.listAssignments);
communicationRouter.get('/assignments/:id', communicationController.getAssignmentDetails);
communicationRouter.post('/assignments', communicationController.createAssignment);
communicationRouter.put('/assignments/:id', communicationController.updateAssignment);
communicationRouter.delete('/assignments/:id', communicationController.deleteAssignment);
communicationRouter.post('/assignments/:assignmentId/submit', communicationController.submitAssignmentWork);
communicationRouter.put('/assignments/:assignmentId/review/:studentId', communicationController.reviewAssignment);
communicationRouter.put('/assignments/:assignmentId/offline-verify/:studentId', communicationController.markOfflineCompletion);

// Gallery
communicationRouter.get('/gallery', communicationController.listAlbums);
communicationRouter.get('/gallery/:id', communicationController.getAlbumDetails);
communicationRouter.post('/gallery', communicationController.createAlbum);
communicationRouter.put('/gallery/:id', communicationController.updateAlbum);
communicationRouter.delete('/gallery/:id', communicationController.deleteAlbum);
communicationRouter.post('/gallery/:albumId/media', communicationController.addMediaToAlbum);
communicationRouter.put('/gallery/media/:mediaId', communicationController.updateMediaItem);
communicationRouter.delete('/gallery/media/:mediaId', communicationController.deleteMediaItem);

// Dashboard & Monitoring
communicationRouter.get('/dashboard/summary', communicationController.getDashboardSummary);
communicationRouter.get('/dashboard/homework-monitoring', communicationController.getHomeworkMonitoring);
communicationRouter.get('/dashboard/assignment-monitoring', communicationController.getAssignmentMonitoring);

// Student / Parent Portal Feed
communicationRouter.get('/portal/student-feed', communicationController.getStudentPortalFeed);

// Multi-Module Feeds for All Classes
communicationRouter.get('/feeds', communicationController.getClassModuleFeeds);

// Audit Trail & Activity History
communicationRouter.get('/history', communicationController.getAuditHistory);
communicationRouter.get('/audit', communicationController.getAuditHistory);

export default communicationRouter;
