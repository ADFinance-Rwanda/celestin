import { Router } from 'express';

import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.use(authenticate);

notificationRouter.get('/', notificationController.getNotifications);

notificationRouter.put(
  '/:id/read',
  notificationController.markAsRead,
);

notificationRouter.put(
  '/read-all',
  notificationController.markAllAsRead,
);

export default notificationRouter;
