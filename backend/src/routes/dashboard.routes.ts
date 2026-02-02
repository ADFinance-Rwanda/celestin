import { Router } from 'express';

import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth';

const dashboardRouter = Router();
const dashboardController = new DashboardController();

dashboardRouter.use(authenticate);

dashboardRouter.get('/stats', dashboardController.getStats);

export default dashboardRouter;
