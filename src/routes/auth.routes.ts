import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { registerValidation, loginValidation } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Cadastrar novo usuário (técnico ou empresa)
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obter dados do usuário autenticado
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token JWT
 * @access  Private
 */
router.post('/refresh', authenticate, authController.refreshToken);

export default router;
