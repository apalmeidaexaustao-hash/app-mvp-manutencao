import { Response, NextFunction } from 'express';
import { AuthRequest, ApiError } from '../types';
import authService from '../services/auth.service';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, 'Token não fornecido');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(401, 'Formato de token inválido. Use: Bearer <token>');
    }

    const token = parts[1];

    const payload = authService.verifyToken(token);

    req.user = payload;

    if (payload.companyId) {
      const isSubscriptionValid = await authService.validateSubscription(payload.companyId);
      
      if (!isSubscriptionValid) {
        throw new ApiError(
          403,
          'Assinatura expirada ou suspensa. Atualize seu plano para continuar usando o sistema'
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Autenticação necessária');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(
          403,
          `Acesso negado. Roles permitidas: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireCompany = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Autenticação necessária');
    }

    if (!req.user.companyId) {
      throw new ApiError(403, 'Esta funcionalidade requer vínculo com uma empresa');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const ensureSameCompany = (resourceCompanyIdGetter: (req: AuthRequest) => string | null) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Autenticação necessária');
      }

      const userCompanyId = req.user.companyId;
      const resourceCompanyId = resourceCompanyIdGetter(req);

      if (req.user.role === 'ADMIN') {
        return next();
      }

      if (userCompanyId !== resourceCompanyId) {
        throw new ApiError(403, 'Acesso negado a recursos de outra empresa');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
