import { PrismaInvitationsRepository } from '@/repositories/prisma/prisma-invitations-repository';
import { ListTenantInvitationsUseCase } from '@/use-cases/invitations/list-tenant-invitations';

export function makeListTenantInvitationsUseCase() {
  const invitationsRepository = new PrismaInvitationsRepository();

  const useCase = new ListTenantInvitationsUseCase(invitationsRepository);

  return useCase;
}
