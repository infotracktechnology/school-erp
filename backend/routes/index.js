import { Router } from 'express';
import { branchRouter } from './branchRoutes.js';
import { academicYearRouter } from './academicYearRoutes.js';
import { classRouter } from './classRoutes.js';
import { sectionRouter } from './sectionRoutes.js';
import { classSectionRouter } from './classSectionRoutes.js';
import { studentRouter } from './studentRoutes.js';
import { studentController } from '../controllers/studentController.js';
import { academicGroupRouter } from './academicGroupRoutes.js';
import { subjectRouter } from './subjectRoutes.js';
import { classSubjectRouter } from './classSubjectRoutes.js';
import { subjectCategoryRouter } from './subjectCategoryRoutes.js';
import { attendanceRouter } from './attendanceRoutes.js';
import { communicationRouter } from './communicationRoutes.js';
import { dashboardRouter } from './dashboardRoutes.js';
import { Organization } from '../models/Organization.js';
import { Branch } from '../models/Branch.js';
import { authRouter } from './authRoutes.js';
import { userManagementRouter } from './userManagementRoutes.js';
import examRouter from './examRoutes.js';
import timetableRouter from './timetableRoutes.js';
import calendarRouter from './calendarRoutes.js';
import anecdoteRouter from './anecdoteRoutes.js';
import staffRouter from './staffRoutes.js';
import permissionRouter from './permissionRoutes.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', async (_req, res) => {
  res.json({
    status: 'ok',
    orm: 'sutando',
    database: 'mysql',
    timestamp: new Date().toISOString()
  });
});

// Organization & Stats
apiRouter.get('/organization', async (_req, res, next) => {
  try {
    const org = await Organization.query().first();
    const totalBranches = await Branch.query().count();

    res.json({
      organization: org || { id: 1, name: 'Vidya Mandir Educational Trust', organization_name: 'Vidya Mandir Educational Trust' },
      stats: {
        total: totalBranches,
        active: totalBranches,
        inactive: 0
      }
    });
  } catch (err) {
    next(err);
  }
});

// Mount domain routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin/users', userManagementRouter);
apiRouter.use('/branches', branchRouter);
apiRouter.use('/academic-years', academicYearRouter);
apiRouter.use('/classes', classRouter);
apiRouter.use('/sections', sectionRouter);
apiRouter.use('/class-sections', classSectionRouter);
apiRouter.use('/students', studentRouter);
apiRouter.get('/students-class-section-history', studentController.getClassSectionHistory);
apiRouter.get('/students-promotions-history', studentController.getPromotionHistory);
apiRouter.use('/academic-groups', academicGroupRouter);
apiRouter.use('/subjects', subjectRouter);
apiRouter.use('/class-subjects', classSubjectRouter);
apiRouter.use('/subject-categories', subjectCategoryRouter);
apiRouter.use('/attendance', attendanceRouter);
apiRouter.use('/communication', communicationRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/examinations', examRouter);
apiRouter.use('/timetable', timetableRouter);
apiRouter.use('/calendar', calendarRouter);
apiRouter.use('/anecdotes', anecdoteRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/permissions', permissionRouter);

export default apiRouter;
