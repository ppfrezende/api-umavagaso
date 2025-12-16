import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { VerifyEmailUseCase } from '@/use-cases/users/verify-email';

export function makeVerifyEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const verifyEmailUseCase = new VerifyEmailUseCase(usersRepository);

  return verifyEmailUseCase;
}
