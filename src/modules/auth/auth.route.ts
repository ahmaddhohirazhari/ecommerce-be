import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// POST /auth/register
router.post('/register', AuthController.register);

// POST /auth/login
router.post('/login', AuthController.login);

export const authRoutes = router;
