import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeResendInvitationUseCase } from '@/use-cases/_factories/invitation-factories/make-resend-invitation-use-case';
import { InvitationNotFoundError } from '@/use-cases/_errors/invitation-not-found-error';
import { InvitationAlreadyUsedError } from '@/use-cases/_errors/invitation-already-used-error';

export async function resend(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    invitationId: z.string().uuid(),
  });

  const { invitationId } = paramsSchema.parse(request.params);

  try {
    const resendInvitationUseCase = makeResendInvitationUseCase();

    const { invitation } = await resendInvitationUseCase.execute({
      invitationId,
    });

    return reply.status(200).send({
      invitation,
    });
  } catch (err) {
    if (err instanceof InvitationNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof InvitationAlreadyUsedError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
