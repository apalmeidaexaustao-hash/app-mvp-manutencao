import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../types';

export interface CreateClientDTO {
  name: string;
  cnpj?: string;
  contactName?: string;
  phone: string;
  email?: string;
  address: string;
}

export interface UpdateClientDTO {
  name?: string;
  cnpj?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface ClientFilters {
  search?: string;
  isActive?: boolean;
  companyId: string;
}

export class ClientService {
  async create(companyId: string, data: CreateClientDTO) {
    if (data.cnpj) {
      const existingClient = await prisma.client.findFirst({
        where: {
          cnpj: data.cnpj,
          companyId,
        },
      });

      if (existingClient) {
        throw new ApiError(409, 'CNPJ já cadastrado para esta empresa');
      }
    }

    const client = await prisma.client.create({
      data: {
        ...data,
        companyId,
      },
      include: {
        _count: {
          select: {
            equipments: true,
            branches: true,
          },
        },
      },
    });

    return client;
  }

  async findAll(filters: ClientFilters, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {
      companyId: filters.companyId,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { contactName: { contains: filters.search, mode: 'insensitive' } },
        { cnpj: { contains: filters.search } },
        { phone: { contains: filters.search } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              equipments: true,
              branches: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, companyId: string) {
    const client = await prisma.client.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        branches: {
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { equipments: true },
            },
          },
        },
        equipments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          where: { status: 'ACTIVE' },
        },
        _count: {
          select: {
            equipments: true,
            branches: true,
            serviceOrders: true,
          },
        },
      },
    });

    if (!client) {
      throw new ApiError(404, 'Cliente não encontrado');
    }

    return client;
  }

  async update(id: string, companyId: string, data: UpdateClientDTO) {
    const client = await this.findById(id, companyId);

    if (data.cnpj && data.cnpj !== client.cnpj) {
      const existingClient = await prisma.client.findFirst({
        where: {
          cnpj: data.cnpj,
          companyId,
          id: { not: id },
        },
      });

      if (existingClient) {
        throw new ApiError(409, 'CNPJ já cadastrado para outro cliente');
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            equipments: true,
            branches: true,
          },
        },
      },
    });

    return updatedClient;
  }

  async delete(id: string, companyId: string) {
    await this.findById(id, companyId);

    const equipmentCount = await prisma.equipment.count({
      where: { clientId: id },
    });

    if (equipmentCount > 0) {
      throw new ApiError(
        400,
        `Não é possível excluir cliente com ${equipmentCount} equipamento(s) cadastrado(s). Desative o cliente ou remova os equipamentos primeiro.`
      );
    }

    await prisma.client.delete({ where: { id } });

    return { message: 'Cliente excluído com sucesso' };
  }

  async deactivate(id: string, companyId: string) {
    await this.findById(id, companyId);

    const client = await prisma.client.update({
      where: { id },
      data: { isActive: false },
    });

    return client;
  }

  async activate(id: string, companyId: string) {
    await this.findById(id, companyId);

    const client = await prisma.client.update({
      where: { id },
      data: { isActive: true },
    });

    return client;
  }

  async getClientStats(id: string, companyId: string) {
    await this.findById(id, companyId);

    const [equipmentCount, activeEquipmentCount, serviceOrderCount, lastServiceOrder] =
      await Promise.all([
        prisma.equipment.count({
          where: { clientId: id },
        }),
        prisma.equipment.count({
          where: { clientId: id, status: 'ACTIVE' },
        }),
        prisma.serviceOrder.count({
          where: { clientId: id },
        }),
        prisma.serviceOrder.findFirst({
          where: { clientId: id },
          orderBy: { scheduledDate: 'desc' },
          include: {
            equipment: {
              select: { type: true, brand: true, model: true },
            },
            technician: {
              include: { user: { select: { name: true } } },
            },
          },
        }),
      ]);

    return {
      equipmentCount,
      activeEquipmentCount,
      inactiveEquipmentCount: equipmentCount - activeEquipmentCount,
      serviceOrderCount,
      lastServiceOrder,
    };
  }
}

export default new ClientService();
