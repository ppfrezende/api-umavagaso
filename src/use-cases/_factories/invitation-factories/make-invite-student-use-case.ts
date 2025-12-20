import { PrismaInvitationsRepository } from '@/repositories/prisma/prisma-invitations-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaUserTenantsRepository } from '@/repositories/prisma/prisma-user-tenants-repository';
import { PrismaTenantsRepository } from '@/repositories/prisma/prisma-tenants-repository';
import { InviteStudentUseCase } from '@/use-cases/invitations/invite-student';

export function makeInviteStudentUseCase() {
  const invitationsRepository = new PrismaInvitationsRepository();
  const usersRepository = new PrismaUsersRepository();
  const userTenantsRepository = new PrismaUserTenantsRepository();
  const tenantsRepository = new PrismaTenantsRepository();

  const useCase = new InviteStudentUseCase(
    invitationsRepository,
    usersRepository,
    userTenantsRepository,
    tenantsRepository
  );

  return useCase;
}
