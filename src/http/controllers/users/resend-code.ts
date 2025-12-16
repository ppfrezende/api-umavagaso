import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeResendVerificationCodeUseCase } from '@/use-cases/_factories/user-factories/make-resend-verification-code-use-case';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { EmailAlreadyVerifiedError } from '@/use-cases/_errors/email-already-verified-error';

export async function resendCode(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    email: z.string().email(),
  });

  const { email } = bodySchema.parse(request.body);

  try {
    const resendVerificationCodeUseCase = makeResendVerificationCodeUseCase();

    const { message } = await resendVerificationCodeUseCase.execute({
      email,
    });

    return reply.status(200).send({
      message,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (err instanceof EmailAlreadyVerifiedError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
