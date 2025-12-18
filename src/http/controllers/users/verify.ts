import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeVerifyEmailUseCase } from '@/use-cases/_factories/user-factories/make-verify-email-use-case';
import { InvalidVerificationTokenError } from '@/use-cases/_errors/invalid-verification-token-error';
import { EmailAlreadyVerifiedError } from '@/use-cases/_errors/email-already-verified-error';

export async function verify(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    token: z.string(),
  });

  const { token } = bodySchema.parse(request.body);

  try {
    const verifyEmailUseCase = makeVerifyEmailUseCase();

    const { user } = await verifyEmailUseCase.execute({
      token,
    });

    return reply.status(200).send({
      message: 'Email verified successfully',
      user: {
        ...user,
        password_hash: undefined,
        emailVerificationToken: undefined,
        emailVerificationExpiry: undefined,
      },
    });
  } catch (err) {
    if (err instanceof InvalidVerificationTokenError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof EmailAlreadyVerifiedError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
