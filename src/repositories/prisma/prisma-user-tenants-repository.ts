import { prisma } from '@/lib/prisma';
import { UserTenant, Role } from '@prisma/client';
import { CreateUserTenantData, UserTenantsRepository } from '../user-tenants-repository';

export class PrismaUserTenantsRepository implements UserTenantsRepository {
  async create(data: CreateUserTenantData): Promise<UserTenant> {
    const userTenant = await prisma.userTenant.create({
      data,
    });

    return userTenant;
  }

  async findByUserIdAndTenantId(userId: string, tenantId: string): Promise<UserTenant | null> {
    const userTenant = await prisma.userTenant.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
    });

    return userTenant;
  }

  async findManyByUserId(userId: string): Promise<UserTenant[]> {
    const userTenants = await prisma.userTenant.findMany({
      where: {
        userId,
      },
      include: {
        tenant: true,
      },
    });

    return userTenants;
  }

  async findManyByTenantId(tenantId: string): Promise<UserTenant[]> {
    const userTenants = await prisma.userTenant.findMany({
      where: {
        tenantId,
      },
      include: {
        user: true,
      },
    });

    return userTenants;
  }

  async delete(userId: string, tenantId: string): Promise<void> {
    await prisma.userTenant.delete({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
    });
  }

  async updateRole(userId: string, tenantId: string, role: Role): Promise<UserTenant> {
    const userTenant = await prisma.userTenant.update({
      where: {
        userId_tenantId: {
          userId,
          tenantId,
        },
      },
      data: {
        role,
      },
    });

    return userTenant;
  }
}
