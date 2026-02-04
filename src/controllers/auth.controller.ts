import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, ApiError } from '../types';
import authService from '../services/auth.service';

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Usuário não autenticado');
      }

      const user = await authService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Usuário não autenticado');
      }

      const newToken = authService.generateToken({
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        companyId: req.user.companyId,
      });

      res.status(200).json({
        success: true,
        message: 'Token renovado com sucesso',
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
