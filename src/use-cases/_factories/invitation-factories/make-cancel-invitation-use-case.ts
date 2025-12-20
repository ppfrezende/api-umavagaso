import { PrismaInvitationsRepository } from '@/repositories/prisma/prisma-invitations-repository';
import { CancelInvitationUseCase } from '@/use-cases/invitations/cancel-invitation';

export function makeCancelInvitationUseCase() {
  const invitationsRepository = new PrismaInvitationsRepository();

  const useCase = new CancelInvitationUseCase(invitationsRepository);

  return useCase;
}
