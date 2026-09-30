import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { RegisterSchema, LoginSchema, ProfileUpdateSchema } from '../../shared/schemas/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(RegisterSchema), AuthController.register);
authRouter.post('/login', validateBody(LoginSchema), AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', requireAuth, AuthController.getMe);

export const profileRouter = Router();

profileRouter.get('/', requireAuth, AuthController.getMe);
profileRouter.patch('/', requireAuth, validateBody(ProfileUpdateSchema), AuthController.updateProfile);
