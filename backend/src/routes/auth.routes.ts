import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', authController.register);

authRouter.post('/login', authController.login);

authRouter.get('/users', authenticate, authController.getUsers);

authRouter.get('/profile', authenticate, authController.getProfile);

export default authRouter;
