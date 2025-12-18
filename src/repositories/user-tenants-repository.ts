import { UserTenant, Role } from '@prisma/client';

export interface CreateUserTenantData {
  userId: string;
  tenantId: string;
  role: Role;
}

export interface UserTenantsRepository {
  create(data: CreateUserTenantData): Promise<UserTenant>;
  findByUserIdAndTenantId(userId: string, tenantId: string): Promise<UserTenant | null>;
  findManyByUserId(userId: string): Promise<UserTenant[]>;
  findManyByTenantId(tenantId: string): Promise<UserTenant[]>;
  delete(userId: string, tenantId: string): Promise<void>;
  updateRole(userId: string, tenantId: string, role: Role): Promise<UserTenant>;
}
