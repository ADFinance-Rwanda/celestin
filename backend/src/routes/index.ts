import { Router } from 'express';

import authRouter from './auth.routes';
import taskRouter from './task.routes';
import notificationRouter from './notification.routes';
import dashboardRouter from './dashboard.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/tasks', taskRouter);
routes.use('/notifications', notificationRouter);
routes.use('/dashboard', dashboardRouter);

export default routes;
