import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';
import { prisma } from '../lib/prisma';
import { Prisma } from '../generated/prisma/browser';

export class DashboardController {
  async getStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.query.userId as string | undefined;

      const where: Prisma.TaskWhereInput = {};
      if (userId) {
        where.assignedToId = userId;
      }

      const [total, pending, inProgress, completed, overdue] =
        await Promise.all([
          prisma.task.count({ where }),
          prisma.task.count({
            where: { ...where, status: 'PENDING' },
          }),
          prisma.task.count({
            where: { ...where, status: 'IN_PROGRESS' },
          }),
          prisma.task.count({
            where: { ...where, status: 'COMPLETED' },
          }),
          prisma.task.count({
            where: {
              ...where,
              dueDate: { lt: new Date() },
              status: { not: 'COMPLETED' },
            },
          }),
        ]);

      res.json({
        total,
        pending,
        inProgress,
        completed,
        overdue,
      });
    } catch (error) {
      next(error);
    }
  }
}
