import { Router } from 'express';
import { authController } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.get('/me', authController.me);
