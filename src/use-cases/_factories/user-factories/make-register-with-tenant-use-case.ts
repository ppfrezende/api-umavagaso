import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterWithTenantUseCase } from '@/use-cases/users/register-with-tenant';

export function makeRegisterWithTenantUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new RegisterWithTenantUseCase(usersRepository);

  return useCase;
}
