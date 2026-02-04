import { Request, Response } from 'express';
import * as serviceOrderService from '../services/service-order.service';
import { ServiceOrderStatus, ServiceOrderType } from '@prisma/client';

export const createServiceOrder = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const data = req.body;

  const serviceOrder = await serviceOrderService.createServiceOrder(
    {
      ...data,
      scheduledDate: new Date(data.scheduledDate),
    },
    companyId
  );

  res.status(201).json({
    success: true,
    message: 'Ordem de serviço criada com sucesso',
    data: serviceOrder,
  });
};

export const listServiceOrders = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const {
    status,
    type,
    clientId,
    equipmentId,
    technicianId,
    startDate,
    endDate,
    page,
    limit,
  } = req.query;

  const filters: any = {
    status: status as ServiceOrderStatus,
    type: type as ServiceOrderType,
    clientId: clientId as string,
    equipmentId: equipmentId as string,
    technicianId: technicianId as string,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  };

  const result = await serviceOrderService.listServiceOrders(filters, companyId);

  res.json({
    success: true,
    ...result,
  });
};

export const getServiceOrderById = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const { id } = req.params;

  const serviceOrder = await serviceOrderService.getServiceOrderById(id, companyId);

  res.json({
    success: true,
    data: serviceOrder,
  });
};

export const updateServiceOrder = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const { id } = req.params;
  const data = req.body;

  if (data.scheduledDate) {
    data.scheduledDate = new Date(data.scheduledDate);
  }

  const serviceOrder = await serviceOrderService.updateServiceOrder(
    id,
    data,
    companyId
  );

  res.json({
    success: true,
    message: 'Ordem de serviço atualizada com sucesso',
    data: serviceOrder,
  });
};

export const updateServiceOrderStatus = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const { id } = req.params;
  const { status } = req.body;

  const serviceOrder = await serviceOrderService.updateServiceOrderStatus(
    id,
    status as ServiceOrderStatus,
    companyId
  );

  res.json({
    success: true,
    message: `Ordem de serviço marcada como ${status}`,
    data: serviceOrder,
  });
};

export const deleteServiceOrder = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const { id } = req.params;

  await serviceOrderService.deleteServiceOrder(id, companyId);

  res.json({
    success: true,
    message: 'Ordem de serviço excluída com sucesso',
  });
};

export const getMyServiceOrders = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const userId = req.user!.id;
  const { status, startDate, endDate } = req.query;

  const technician = await serviceOrderService.prisma.technician.findUnique({
    where: { userId },
  });

  if (!technician) {
    return res.status(404).json({
      success: false,
      message: 'Técnico não encontrado',
    });
  }

  const filters: any = {
    status: status as ServiceOrderStatus,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
  };

  const serviceOrders = await serviceOrderService.getMyServiceOrders(
    technician.id,
    companyId,
    filters
  );

  res.json({
    success: true,
    data: serviceOrders,
    count: serviceOrders.length,
  });
};

export const getCalendar = async (req: Request, res: Response) => {
  const companyId = req.user!.companyId;
  const { startDate, endDate, technicianId } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'startDate e endDate são obrigatórios',
    });
  }

  const calendar = await serviceOrderService.getCalendar(
    companyId,
    new Date(startDate as string),
    new Date(endDate as string),
    technicianId as string | undefined
  );

  res.json({
    success: true,
    data: calendar,
  });
};
