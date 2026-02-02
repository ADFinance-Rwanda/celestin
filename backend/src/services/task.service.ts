import {
  NotificationType,
  Prisma,
} from '../generated/prisma/browser';
import { prisma } from '../lib/prisma';
import {
  CreateTaskDTO,
  TasksSearchParams,
  UpdateTaskDTO,
} from '../types/schema';

import { NotificationService } from './notification.service';

const notificationService = new NotificationService();

export class TaskService {
  async createTask(data: CreateTaskDTO, createdById: string) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedToId: data.assignedToId,
        dueDate: data.dueDate,
        createdById,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create notification if task is assigned
    if (task.assignedToId) {
      await notificationService.createNotification({
        userId: task.assignedToId,
        taskId: task.id,
        type: NotificationType.TASK_ASSIGNED,
        message: `New task assigned: ${task.title}`,
      });
    }

    return task;
  }

  async getTasks(params: TasksSearchParams) {
    const where: Prisma.TaskWhereInput = {};

    if (params.userId) {
      where.assignedToId = params.userId;
    }

    if (params.status) {
      where.status = params.status;
    }

    return prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async updateTask(id: string, data: UpdateTaskDTO) {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create notification for status change
    if (
      data.status &&
      existingTask.status !== data.status &&
      task.assignedToId
    ) {
      await notificationService.createNotification({
        userId: task.assignedToId,
        taskId: task.id,
        type: NotificationType.TASK_STATUS_CHANGED,
        message: `Task "${task.title}" status changed to ${data.status}`,
      });
    }

    return task;
  }

  async deleteTask(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({ where: { id } });

    return { message: 'Task deleted successfully' };
  }
}
