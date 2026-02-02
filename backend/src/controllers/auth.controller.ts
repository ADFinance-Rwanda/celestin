import { NextFunction, Response } from 'express';

import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../types/schema';

const authService = new AuthService();

export class AuthController {
  async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authService.register(payload);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body);

      const result = await authService.login(payload);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const users = await authService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    res.json(req.user);
  }
}
