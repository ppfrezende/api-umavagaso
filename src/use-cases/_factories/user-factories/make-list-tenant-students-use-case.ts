import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ListTenantStudentsUseCase } from '@/use-cases/users/list-tenant-students';

export function makeListTenantStudentsUseCase() {
  const usersRepository = new PrismaUsersRepository();

  const useCase = new ListTenantStudentsUseCase(usersRepository);

  return useCase;
}
