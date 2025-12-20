import { PrismaInvitationsRepository } from '@/repositories/prisma/prisma-invitations-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AcceptInvitationUseCase } from '@/use-cases/invitations/accept-invitation';

export function makeAcceptInvitationUseCase() {
  const invitationsRepository = new PrismaInvitationsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new AcceptInvitationUseCase(
    invitationsRepository,
    usersRepository
  );

  return useCase;
}
