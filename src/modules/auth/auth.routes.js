import express from 'express';
import { register, login, getMe } from './auth.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;

