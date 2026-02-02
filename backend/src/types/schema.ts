import { z } from 'zod';

import { TaskStatus } from '../generated/prisma/enums';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z
    .enum([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ])
    .optional(),
});

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const tasksSearchParamsSchema = z.object({
  userId: z.string().optional(),
  status: z
    .enum([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ])
    .optional(),
});

export type TasksSearchParams = z.infer<
  typeof tasksSearchParamsSchema
>;
