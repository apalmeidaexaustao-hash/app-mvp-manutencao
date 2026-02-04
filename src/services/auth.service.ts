import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole, SubscriptionPlan } from '@prisma/client';
import prisma from '../config/database';
import config from '../config';
import { RegisterDTO, LoginDTO, AuthResponse, JWTPayload, ApiError } from '../types';

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password, name, phone, companyName, role = 'TECHNICIAN' } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    let company = null;

    if (role === 'ADMIN' || role === 'MANAGER') {
      if (!companyName) {
        throw new ApiError(400, 'Nome da empresa é obrigatório para Admin/Manager');
      }

      company = await prisma.company.create({
        data: {
          name: companyName,
          phone,
          email,
          subscriptionPlan: SubscriptionPlan.FREE,
          subscriptionStatus: 'TRIAL',
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      });
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone,
        role,
        companyId: company?.id || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (role === 'TECHNICIAN' && company) {
      await prisma.technician.create({
        data: {
          userId: user.id,
          companyId: company.id,
          specialties: [],
        },
      });
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        role: true,
        companyId: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Email ou senha incorretos');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Usuário desativado. Entre em contato com o suporte');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Email ou senha incorretos');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        companyId: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
          },
        },
        technician: {
          select: {
            id: true,
            registration: true,
            specialties: true,
            isAvailable: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado');
    }

    return user;
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token expirado. Faça login novamente');
      }
      throw new ApiError(401, 'Token inválido');
    }
  }

  async validateSubscription(companyId: string): Promise<boolean> {
    if (!companyId) return true;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        trialEndsAt: true,
      },
    });

    if (!company) {
      throw new ApiError(404, 'Empresa não encontrada');
    }

    if (company.subscriptionStatus === 'ACTIVE') {
      if (company.subscriptionEndsAt && company.subscriptionEndsAt < new Date()) {
        await prisma.company.update({
          where: { id: companyId },
          data: { subscriptionStatus: 'SUSPENDED' },
        });
        return false;
      }
      return true;
    }

    if (company.subscriptionStatus === 'TRIAL') {
      if (company.trialEndsAt && company.trialEndsAt < new Date()) {
        await prisma.company.update({
          where: { id: companyId },
          data: { subscriptionStatus: 'SUSPENDED' },
        });
        return false;
      }
      return true;
    }

    return false;
  }
}

export default new AuthService();
