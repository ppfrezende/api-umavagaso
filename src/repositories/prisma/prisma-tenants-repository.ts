import { Prisma, Tenant } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { TenantsRepository } from '../tenants-repository';

export class PrismaTenantsRepository implements TenantsRepository {
  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    const tenant = await prisma.tenant.create({
      data,
    });

    return tenant;
  }

  async findById(id: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    return tenant;
  }

  async findByName(name: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findFirst({
      where: { name },
    });

    return tenant;
  }
}
