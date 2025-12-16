import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ResendVerificationCodeUseCase } from '@/use-cases/users/resend-verification-code';

export function makeResendVerificationCodeUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const resendVerificationCodeUseCase = new ResendVerificationCodeUseCase(usersRepository);

  return resendVerificationCodeUseCase;
}
