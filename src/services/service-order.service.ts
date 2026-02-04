import { PrismaClient, ServiceOrderStatus, ServiceOrderType } from '@prisma/client';
import { ApiError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export { prisma };

interface CreateServiceOrderInput {
  clientId: string;
  equipmentId: string;
  branchId?: string;
  type: ServiceOrderType;
  scheduledDate: Date;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  technicianId?: string;
}

interface UpdateServiceOrderInput {
  scheduledDate?: Date;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  technicianId?: string;
}

interface ListServiceOrdersFilters {
  status?: ServiceOrderStatus;
  type?: ServiceOrderType;
  clientId?: string;
  equipmentId?: string;
  technicianId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export const createServiceOrder = async (
  data: CreateServiceOrderInput,
  companyId: string
) => {
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client || client.companyId !== companyId) {
    throw new ApiError(404, 'Cliente não encontrado');
  }

  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment || equipment.clientId !== data.clientId) {
    throw new ApiError(404, 'Equipamento não encontrado ou não pertence ao cliente');
  }

  if (data.branchId) {
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
    });

    if (!branch || branch.clientId !== data.clientId) {
      throw new ApiError(404, 'Filial não encontrada ou não pertence ao cliente');
    }
  }

  if (data.technicianId) {
    const technician = await prisma.technician.findUnique({
      where: { id: data.technicianId },
      include: { user: true },
    });

    if (!technician || technician.user.companyId !== companyId) {
      throw new ApiError(404, 'Técnico não encontrado ou não pertence à empresa');
    }
  }

  if (new Date(data.scheduledDate) < new Date()) {
    throw new ApiError(400, 'Data agendada não pode ser no passado');
  }

  const lastOrder = await prisma.serviceOrder.findFirst({
    where: { companyId },
    orderBy: { orderNumber: 'desc' },
  });

  const currentYear = new Date().getFullYear();
  const lastNumber = lastOrder?.orderNumber.split('-')[2] || '0';
  const nextNumber = (parseInt(lastNumber) + 1).toString().padStart(4, '0');
  const orderNumber = `OS-${currentYear}-${nextNumber}`;

  const serviceOrder = await prisma.serviceOrder.create({
    data: {
      orderNumber,
      companyId,
      clientId: data.clientId,
      equipmentId: data.equipmentId,
      branchId: data.branchId,
      type: data.type,
      status: 'SCHEDULED',
      scheduledDate: data.scheduledDate,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      technicianId: data.technicianId,
    },
    include: {
      client: true,
      equipment: {
        include: {
          branch: true,
        },
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  return serviceOrder;
};

export const listServiceOrders = async (
  filters: ListServiceOrdersFilters,
  companyId: string
) => {
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);
  const skip = (page - 1) * limit;

  const where: any = { companyId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters.equipmentId) {
    where.equipmentId = filters.equipmentId;
  }

  if (filters.technicianId) {
    where.technicianId = filters.technicianId;
  }

  if (filters.startDate || filters.endDate) {
    where.scheduledDate = {};
    if (filters.startDate) {
      where.scheduledDate.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.scheduledDate.lte = filters.endDate;
    }
  }

  const [serviceOrders, total] = await Promise.all([
    prisma.serviceOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledDate: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        equipment: {
          select: {
            id: true,
            type: true,
            brand: true,
            model: true,
            location: true,
          },
        },
        technician: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
        _count: {
          select: {
            checklistExecutions: true,
          },
        },
      },
    }),
    prisma.serviceOrder.count({ where }),
  ]);

  return {
    data: serviceOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getServiceOrderById = async (id: string, companyId: string) => {
  const serviceOrder = await prisma.serviceOrder.findFirst({
    where: { id, companyId },
    include: {
      client: true,
      equipment: {
        include: {
          branch: true,
        },
      },
      branch: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      checklistExecutions: {
        include: {
          checklistTemplate: {
            select: {
              id: true,
              name: true,
              equipmentType: true,
            },
          },
          _count: {
            select: {
              itemResponses: true,
              findings: true,
            },
          },
        },
      },
      maintenanceReport: true,
      quotation: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!serviceOrder) {
    throw new ApiError(404, 'Ordem de serviço não encontrada');
  }

  return serviceOrder;
};

export const updateServiceOrder = async (
  id: string,
  data: UpdateServiceOrderInput,
  companyId: string
) => {
  const serviceOrder = await prisma.serviceOrder.findFirst({
    where: { id, companyId },
  });

  if (!serviceOrder) {
    throw new ApiError(404, 'Ordem de serviço não encontrada');
  }

  if (serviceOrder.status === 'COMPLETED' || serviceOrder.status === 'CANCELLED') {
    throw new ApiError(400, 'Não é possível atualizar uma OS concluída ou cancelada');
  }

  if (data.scheduledDate && new Date(data.scheduledDate) < new Date()) {
    throw new ApiError(400, 'Data agendada não pode ser no passado');
  }

  if (data.technicianId) {
    const technician = await prisma.technician.findUnique({
      where: { id: data.technicianId },
      include: { user: true },
    });

    if (!technician || technician.user.companyId !== companyId) {
      throw new ApiError(404, 'Técnico não encontrado ou não pertence à empresa');
    }
  }

  const updatedServiceOrder = await prisma.serviceOrder.update({
    where: { id },
    data: {
      scheduledDate: data.scheduledDate,
      description: data.description,
      priority: data.priority,
      technicianId: data.technicianId,
    },
    include: {
      client: true,
      equipment: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  return updatedServiceOrder;
};

export const updateServiceOrderStatus = async (
  id: string,
  status: ServiceOrderStatus,
  companyId: string
) => {
  const serviceOrder = await prisma.serviceOrder.findFirst({
    where: { id, companyId },
  });

  if (!serviceOrder) {
    throw new ApiError(404, 'Ordem de serviço não encontrada');
  }

  if (serviceOrder.status === 'COMPLETED' && status !== 'COMPLETED') {
    throw new ApiError(400, 'Não é possível alterar status de uma OS concluída');
  }

  if (serviceOrder.status === 'CANCELLED' && status !== 'CANCELLED') {
    throw new ApiError(400, 'Não é possível alterar status de uma OS cancelada');
  }

  const updatedData: any = { status };

  if (status === 'IN_PROGRESS' && !serviceOrder.startedAt) {
    updatedData.startedAt = new Date();
  }

  if (status === 'COMPLETED' && !serviceOrder.completedAt) {
    updatedData.completedAt = new Date();
  }

  const updatedServiceOrder = await prisma.serviceOrder.update({
    where: { id },
    data: updatedData,
    include: {
      client: true,
      equipment: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  return updatedServiceOrder;
};

export const deleteServiceOrder = async (id: string, companyId: string) => {
  const serviceOrder = await prisma.serviceOrder.findFirst({
    where: { id, companyId },
    include: {
      _count: {
        select: {
          checklistExecutions: true,
        },
      },
    },
  });

  if (!serviceOrder) {
    throw new ApiError(404, 'Ordem de serviço não encontrada');
  }

  if (serviceOrder.status === 'COMPLETED') {
    throw new ApiError(
      400,
      'Não é possível excluir uma OS concluída. Use cancelamento.'
    );
  }

  if (serviceOrder._count.checklistExecutions > 0) {
    throw new ApiError(
      400,
      `Não é possível excluir OS com ${serviceOrder._count.checklistExecutions} checklist(s) executado(s)`
    );
  }

  await prisma.serviceOrder.delete({
    where: { id },
  });

  return true;
};

export const getMyServiceOrders = async (
  technicianId: string,
  companyId: string,
  filters?: {
    status?: ServiceOrderStatus;
    startDate?: Date;
    endDate?: Date;
  }
) => {
  const where: any = {
    companyId,
    technicianId,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.scheduledDate = {};
    if (filters.startDate) {
      where.scheduledDate.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.scheduledDate.lte = filters.endDate;
    }
  }

  const serviceOrders = await prisma.serviceOrder.findMany({
    where,
    orderBy: { scheduledDate: 'asc' },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
      },
      equipment: {
        select: {
          id: true,
          type: true,
          brand: true,
          model: true,
          location: true,
          status: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
      _count: {
        select: {
          checklistExecutions: true,
        },
      },
    },
  });

  return serviceOrders;
};

export const getCalendar = async (
  companyId: string,
  startDate: Date,
  endDate: Date,
  technicianId?: string
) => {
  const where: any = {
    companyId,
    scheduledDate: {
      gte: startDate,
      lte: endDate,
    },
    status: {
      in: ['SCHEDULED', 'IN_PROGRESS'],
    },
  };

  if (technicianId) {
    where.technicianId = technicianId;
  }

  const serviceOrders = await prisma.serviceOrder.findMany({
    where,
    orderBy: { scheduledDate: 'asc' },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      equipment: {
        select: {
          id: true,
          type: true,
          brand: true,
          model: true,
          location: true,
        },
      },
      technician: {
        include: {
          user: {
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

  const groupedByDate: Record<string, any[]> = {};

  serviceOrders.forEach((order) => {
    const dateKey = order.scheduledDate.toISOString().split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(order);
  });

  return {
    startDate,
    endDate,
    totalOrders: serviceOrders.length,
    ordersByDate: groupedByDate,
  };
};
