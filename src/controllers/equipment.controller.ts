import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, ApiError } from '../types';
import equipmentService from '../services/equipment.service';
import { EquipmentStatus } from '@prisma/client';

export class EquipmentController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const equipment = await equipmentService.create(req.user.companyId, req.body);

      res.status(201).json({
        success: true,
        message: 'Equipamento cadastrado com sucesso',
        data: equipment,
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

      const { search, type, status, clientId, branchId, page = '1', limit = '20' } = req.query;

      const filters = {
        search: search as string,
        type: type as any,
        status: status as any,
        clientId: clientId as string,
        branchId: branchId as string,
        companyId: req.user.companyId,
      };

      const result = await equipmentService.findAll(
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

      const equipment = await equipmentService.findById(
        req.params.id,
        req.user.companyId
      );

      res.status(200).json({
        success: true,
        data: equipment,
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

      const equipment = await equipmentService.update(
        req.params.id,
        req.user.companyId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Equipamento atualizado com sucesso',
        data: equipment,
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

      const result = await equipmentService.delete(req.params.id, req.user.companyId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
      }

      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const { status } = req.body;
      const equipment = await equipmentService.updateStatus(
        req.params.id,
        req.user.companyId,
        status as EquipmentStatus
      );

      res.status(200).json({
        success: true,
        message: `Equipamento marcado como ${status}`,
        data: equipment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const { limit = '10' } = req.query;

      const history = await equipmentService.getEquipmentHistory(
        req.params.id,
        req.user.companyId,
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMaintenance(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const { days = '30' } = req.query;

      const alerts = await equipmentService.getUpcomingMaintenance(
        req.user.companyId,
        parseInt(days as string)
      );

      res.status(200).json({
        success: true,
        data: alerts,
        count: alerts.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByClient(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.companyId) {
        throw new ApiError(403, 'Usuário sem empresa vinculada');
      }

      const result = await equipmentService.getEquipmentsByClient(
        req.params.clientId,
        req.user.companyId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EquipmentController();
