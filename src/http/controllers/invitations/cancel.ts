import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCancelInvitationUseCase } from '@/use-cases/_factories/invitation-factories/make-cancel-invitation-use-case';
import { InvitationNotFoundError } from '@/use-cases/_errors/invitation-not-found-error';
import { InvitationAlreadyUsedError } from '@/use-cases/_errors/invitation-already-used-error';

export async function cancel(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    invitationId: z.string().uuid(),
  });

  const { invitationId } = paramsSchema.parse(request.params);

  try {
    const cancelInvitationUseCase = makeCancelInvitationUseCase();

    const { invitation } = await cancelInvitationUseCase.execute({
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
