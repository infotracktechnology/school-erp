import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController.js';

export const attendanceRouter = Router();

attendanceRouter.get('/', attendanceController.list);
attendanceRouter.post('/', attendanceController.markAttendance);
attendanceRouter.get('/check-existing', attendanceController.checkExisting);
attendanceRouter.get('/remarks', attendanceController.getRemarks);
attendanceRouter.get('/students-to-mark', attendanceController.getStudentsToMark);
attendanceRouter.post('/submit', attendanceController.submitAttendance);
attendanceRouter.get('/history', attendanceController.getHistory);
attendanceRouter.get('/record-details', attendanceController.getRecordDetails);
attendanceRouter.put('/update-single', attendanceController.updateSingleRecord);
attendanceRouter.get('/monthly-report', attendanceController.getMonthlyReport);
attendanceRouter.get('/absent-report', attendanceController.getAbsentReport);
attendanceRouter.get('/summary', attendanceController.getSummary);
attendanceRouter.get('/resolve-timing', attendanceController.resolveTiming);

// Reports
attendanceRouter.get('/reports/daily', attendanceController.getDailyReport);
attendanceRouter.get('/reports/student-wise', attendanceController.getStudentWiseReport);
attendanceRouter.get('/reports/student-individual', attendanceController.getStudentIndividualReport);
attendanceRouter.get('/reports/student-individual/:studentId', attendanceController.getStudentIndividualReport);
attendanceRouter.get('/reports/consecutive-absent', attendanceController.getConsecutiveAbsentReport);
attendanceRouter.get('/reports/consecutive-leave', attendanceController.getConsecutiveLeaveReport);
attendanceRouter.get('/reports/consecutive-late', attendanceController.getConsecutiveLateReport);
attendanceRouter.get('/reports/frequent-absence', attendanceController.getFrequentAbsenceReport);
attendanceRouter.get('/reports/late-students', attendanceController.getLateStudentsReport);
attendanceRouter.get('/reports/low-attendance', attendanceController.getLowAttendanceReport);
attendanceRouter.get('/reports/completion', attendanceController.getCompletionStats);
attendanceRouter.get('/reports/monthly', attendanceController.getMonthlyReport);

// Timings
attendanceRouter.get('/timings', attendanceController.getTimings);
attendanceRouter.post('/timings', attendanceController.createTiming);
attendanceRouter.put('/timings/:id', attendanceController.updateTiming);
attendanceRouter.patch('/timings/:id/status', attendanceController.toggleTimingStatus);

// Assignments
attendanceRouter.get('/assignments', attendanceController.getAssignments);
attendanceRouter.post('/assignments', attendanceController.createAssignment);
attendanceRouter.patch('/assignments/:id/status', attendanceController.toggleAssignmentStatus);
attendanceRouter.delete('/assignments/:id', attendanceController.deleteAssignment);

export default attendanceRouter;
