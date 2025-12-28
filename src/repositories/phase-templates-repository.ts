import { PhaseTemplate, Prisma } from '@prisma/client';

export interface PhaseTemplatesRepository {
  create(data: Prisma.PhaseTemplateCreateInput): Promise<PhaseTemplate>;
  findById(id: string): Promise<PhaseTemplate | null>;
  findByTenantId(tenantId: string): Promise<PhaseTemplate[]>;
  findByTenantIdAndOrder(tenantId: string, order: number): Promise<PhaseTemplate | null>;
  findActiveByTenantId(tenantId: string): Promise<PhaseTemplate[]>;
  update(id: string, data: Prisma.PhaseTemplateUpdateInput): Promise<PhaseTemplate>;
  delete(id: string): Promise<void>;
}