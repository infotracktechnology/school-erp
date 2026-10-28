import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

export const dashboardRouter = Router();

dashboardRouter.get('/super-admin', dashboardController.superAdmin);
dashboardRouter.get('/drill-down', dashboardController.drillDown);

export default dashboardRouter;
