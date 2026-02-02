import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications =
        await notificationService.getNotifications(
          req.user!.id,
          unreadOnly,
        );
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id as string,
        req.user!.id,
      );
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await notificationService.markAllAsRead(
        req.user!.id,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
