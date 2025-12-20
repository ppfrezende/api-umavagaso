import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeAcceptInvitationUseCase } from '@/use-cases/_factories/invitation-factories/make-accept-invitation-use-case';
import { InvitationNotFoundError } from '@/use-cases/_errors/invitation-not-found-error';
import { InvitationExpiredError } from '@/use-cases/_errors/invitation-expired-error';
import { InvitationAlreadyUsedError } from '@/use-cases/_errors/invitation-already-used-error';

export async function accept(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    token: z.string(),
  });

  const bodySchema = z.object({
    name: z.string().optional(),
    password: z.string().min(6).optional(),
    avatar: z.string().optional(),
  });

  const { token } = paramsSchema.parse(request.params);
  const userData = bodySchema.parse(request.body);

  try {
    const acceptInvitationUseCase = makeAcceptInvitationUseCase();

    const hasUserData = userData.name && userData.password;

    const { user } = await acceptInvitationUseCase.execute({
      token,
      userData: hasUserData
        ? {
            name: userData.name!,
            password: userData.password!,
            avatar: userData.avatar,
          }
        : undefined,
    });

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (err) {
    if (err instanceof InvitationNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof InvitationExpiredError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvitationAlreadyUsedError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
