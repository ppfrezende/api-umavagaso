import { PrismaInvitationsRepository } from '@/repositories/prisma/prisma-invitations-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaTenantsRepository } from '@/repositories/prisma/prisma-tenants-repository';
import { ResendInvitationUseCase } from '@/use-cases/invitations/resend-invitation';

export function makeResendInvitationUseCase() {
  const invitationsRepository = new PrismaInvitationsRepository();
  const usersRepository = new PrismaUsersRepository();
  const tenantsRepository = new PrismaTenantsRepository();

  const useCase = new ResendInvitationUseCase(
    invitationsRepository,
    usersRepository,
    tenantsRepository
  );

  return useCase;
}
