import { Prisma, Tenant } from '@prisma/client';

export interface TenantsRepository {
  create(data: Prisma.TenantCreateInput): Promise<Tenant>;
  findById(id: string): Promise<Tenant | null>;
  findByName(name: string): Promise<Tenant | null>;
}
