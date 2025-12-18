import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateUserUseCase } from '@/use-cases/users/create-user';

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateUserUseCase(usersRepository);

  return useCase;
}
