import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';
import { TaskService } from '../services/task.service';
import {
  createTaskSchema,
  tasksSearchParamsSchema,
  updateTaskSchema,
} from '../types/schema';

const taskService = new TaskService();

export class TaskController {
  async createTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const payload = createTaskSchema.parse(req.body);

      const task = await taskService.createTask(
        payload,
        req.user!.id,
      );
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const params = tasksSearchParamsSchema.parse(req.query);
      const tasks = await taskService.getTasks(params);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const task = await taskService.getTaskById(
        req.params.id as string,
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const payload = updateTaskSchema.parse(req.body);

      const task = await taskService.updateTask(
        req.params.id as string,
        payload,
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await taskService.deleteTask(
        req.params.id as string,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
