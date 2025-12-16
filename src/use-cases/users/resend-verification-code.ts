import { UsersRepository } from '../../repositories/users-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';
import { EmailAlreadyVerifiedError } from '../_errors/email-already-verified-error';
import { generateVerificationToken, getVerificationTokenExpiry } from '@/lib/generate-verification-token';
import { mailService } from '@/lib/mail';

interface ResendVerificationCodeUseCaseRequest {
  email: string;
}

interface ResendVerificationCodeUseCaseResponse {
  message: string;
}

export class ResendVerificationCodeUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: ResendVerificationCodeUseCaseRequest): Promise<ResendVerificationCodeUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (user.emailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationTokenExpiry();

    await this.usersRepository.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    await mailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    return {
      message: 'Verification code resent successfully',
    };
  }
}
