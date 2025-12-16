import { User } from '@prisma/client';
import { UsersRepository } from '../../repositories/users-repository';
import { InvalidVerificationTokenError } from '../_errors/invalid-verification-token-error';
import { EmailAlreadyVerifiedError } from '../_errors/email-already-verified-error';

interface VerifyEmailUseCaseRequest {
  token: string;
}

interface VerifyEmailUseCaseResponse {
  user: User;
}

export class VerifyEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    token,
  }: VerifyEmailUseCaseRequest): Promise<VerifyEmailUseCaseResponse> {
    const user = await this.usersRepository.findByVerificationToken(token);

    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    if (user.emailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    // Verificar se o token expirou
    if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
      throw new InvalidVerificationTokenError();
    }

    // Atualizar usuário: marcar como verificado E ativar conta
    const updatedUser = await this.usersRepository.update(user.id, {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpiry: null,
      isActive: true, // Ativar usuário após verificação
    });

    return { user: updatedUser };
  }
}
