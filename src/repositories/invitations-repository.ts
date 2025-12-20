import { Invitation, InvitationStatus, Prisma } from '@prisma/client';

export interface InvitationsRepository {
  create(data: Prisma.InvitationCreateInput): Promise<Invitation>;
  findById(id: string): Promise<Invitation | null>;
  findByToken(token: string): Promise<Invitation | null>;
  findByEmailAndTenantId(email: string, tenantId: string): Promise<Invitation | null>;
  findPendingByEmailAndTenantId(email: string, tenantId: string): Promise<Invitation | null>;
  findManyByTenantId(tenantId: string): Promise<Invitation[]>;
  findManyPendingByTenantId(tenantId: string): Promise<Invitation[]>;
  update(id: string, data: Prisma.InvitationUpdateInput): Promise<Invitation>;
  updateStatus(id: string, status: InvitationStatus): Promise<Invitation>;
  delete(id: string): Promise<void>;
}
