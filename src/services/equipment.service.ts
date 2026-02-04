import { EquipmentType, EquipmentStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../types';

export interface CreateEquipmentDTO {
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber?: string;
  capacity?: string;
  installationDate?: Date;
  location: string;
  clientId: string;
  branchId?: string;
  notes?: string;
}

export interface UpdateEquipmentDTO {
  type?: EquipmentType;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: string;
  installationDate?: Date;
  location?: string;
  branchId?: string;
  status?: EquipmentStatus;
  notes?: string;
}

export interface EquipmentFilters {
  search?: string;
  type?: EquipmentType;
  status?: EquipmentStatus;
  clientId?: string;
  branchId?: string;
  companyId: string;
}

export class EquipmentService {
  async create(companyId: string, data: CreateEquipmentDTO) {
    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        companyId,
      },
    });

    if (!client) {
      throw new ApiError(404, 'Cliente não encontrado');
    }

    if (data.branchId) {
      const branch = await prisma.branch.findFirst({
        where: {
          id: data.branchId,
          clientId: data.clientId,
        },
      });

      if (!branch) {
        throw new ApiError(404, 'Filial não encontrada para este cliente');
      }
    }

    if (data.serialNumber) {
      const existingEquipment = await prisma.equipment.findFirst({
        where: {
          serialNumber: data.serialNumber,
          companyId,
        },
      });

      if (existingEquipment) {
        throw new ApiError(409, 'Número de série já cadastrado');
      }
    }

    const equipment = await prisma.equipment.create({
      data: {
        ...data,
        companyId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return equipment;
  }

  async findAll(filters: EquipmentFilters, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const where: Prisma.EquipmentWhereInput = {
      companyId: filters.companyId,
    };

    if (filters.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { serialNumber: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { client: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.branchId) {
      where.branchId = filters.branchId;
    }

    const [equipments, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              serviceOrders: true,
              maintenanceHistory: true,
            },
          },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    return {
      data: equipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, companyId: string) {
    const equipment = await prisma.equipment.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            contactName: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        maintenanceHistory: {
          orderBy: { executedAt: 'desc' },
          take: 5,
          include: {
            serviceOrder: {
              select: {
                id: true,
                orderNumber: true,
                type: true,
              },
            },
          },
        },
        maintenanceAlerts: {
          where: {
            status: { in: ['PENDING', 'SENT'] },
          },
          orderBy: { dueDate: 'asc' },
        },
        _count: {
          select: {
            serviceOrders: true,
            maintenanceHistory: true,
            checklistExecutions: true,
          },
        },
      },
    });

    if (!equipment) {
      throw new ApiError(404, 'Equipamento não encontrado');
    }

    return equipment;
  }

  async update(id: string, companyId: string, data: UpdateEquipmentDTO) {
    await this.findById(id, companyId);

    if (data.serialNumber) {
      const existingEquipment = await prisma.equipment.findFirst({
        where: {
          serialNumber: data.serialNumber,
          companyId,
          id: { not: id },
        },
      });

      if (existingEquipment) {
        throw new ApiError(409, 'Número de série já cadastrado para outro equipamento');
      }
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return equipment;
  }

  async delete(id: string, companyId: string) {
    await this.findById(id, companyId);

    const serviceOrderCount = await prisma.serviceOrder.count({
      where: { equipmentId: id },
    });

    if (serviceOrderCount > 0) {
      throw new ApiError(
        400,
        `Não é possível excluir equipamento com ${serviceOrderCount} ordem(ns) de serviço. Desative o equipamento em vez de excluí-lo.`
      );
    }

    await prisma.equipment.delete({ where: { id } });

    return { message: 'Equipamento excluído com sucesso' };
  }

  async updateStatus(id: string, companyId: string, status: EquipmentStatus) {
    await this.findById(id, companyId);

    const equipment = await prisma.equipment.update({
      where: { id },
      data: { status },
      include: {
        client: {
          select: { name: true },
        },
      },
    });

    return equipment;
  }

  async getEquipmentHistory(id: string, companyId: string, limit: number = 10) {
    await this.findById(id, companyId);

    const history = await prisma.maintenanceHistory.findMany({
      where: { equipmentId: id },
      orderBy: { executedAt: 'desc' },
      take: limit,
      include: {
        serviceOrder: {
          select: {
            id: true,
            orderNumber: true,
            type: true,
            status: true,
          },
        },
      },
    });

    return history;
  }

  async getUpcomingMaintenance(companyId: string, days: number = 30) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const alerts = await prisma.maintenanceAlert.findMany({
      where: {
        equipment: { companyId },
        status: 'PENDING',
        dueDate: {
          lte: dueDate,
        },
      },
      orderBy: { dueDate: 'asc' },
      include: {
        equipment: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return alerts;
  }

  async getEquipmentsByClient(clientId: string, companyId: string) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        companyId,
      },
    });

    if (!client) {
      throw new ApiError(404, 'Cliente não encontrado');
    }

    const equipments = await prisma.equipment.findMany({
      where: {
        clientId,
        companyId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            serviceOrders: true,
          },
        },
      },
    });

    const summary = {
      total: equipments.length,
      byStatus: {
        active: equipments.filter((e) => e.status === 'ACTIVE').length,
        inactive: equipments.filter((e) => e.status === 'INACTIVE').length,
        maintenance: equipments.filter((e) => e.status === 'MAINTENANCE').length,
        retired: equipments.filter((e) => e.status === 'RETIRED').length,
      },
      byType: equipments.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      equipments,
      summary,
    };
  }
}

export default new EquipmentService();
