import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, ApiError } from '../types';
import clientService from '../services/client.service';

export class ClientController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const client = await clientService.create(req.user.companyId, req.body);

      res.status(201).json({
        success: true,
        message: 'Cliente cadastrado com sucesso',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const { search, isActive, page = '1', limit = '20' } = req.query;

      const filters = {
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        companyId: req.user.companyId,
      };

      const result = await clientService.findAll(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const client = await clientService.findById(req.params.id, req.user.companyId);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const client = await clientService.update(
        req.params.id,
        req.user.companyId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const result = await clientService.delete(req.params.id, req.user.companyId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const client = await clientService.deactivate(req.params.id, req.user.companyId);

      res.status(200).json({
        success: true,
        message: 'Cliente desativado com sucesso',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const client = await clientService.activate(req.params.id, req.user.companyId);

      res.status(200).json({
        success: true,
        message: 'Cliente ativado com sucesso',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const stats = await clientService.getClientStats(
        req.params.id,
        req.user.companyId
      );

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();
