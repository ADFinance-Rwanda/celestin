import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  console.error(err);
  let message = err.message || 'Internal Server Error';
  if (err instanceof z.ZodError) {
    res.status(400);
    const errors = err.issues.map(issue => {
      return issue.message;
    });
    message = errors.join(', ');
  }
  res.status(err.status || 500).json({
    message: message,
  });
};
