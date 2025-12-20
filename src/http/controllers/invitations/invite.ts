import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeInviteStudentUseCase } from '@/use-cases/_factories/invitation-factories/make-invite-student-use-case';
import { CannotInviteOwnerError } from '@/use-cases/_errors/cannot-invite-owner-error';
import { CannotInviteMentorError } from '@/use-cases/_errors/cannot-invite-mentor-error';
import { UserAlreadyMemberOfTenantError } from '@/use-cases/_errors/user-already-member-of-tenant-error';
import { PendingInvitationAlreadyExistsError } from '@/use-cases/_errors/pending-invitation-already-exists-error';
import { UnauthorizedToInviteError } from '@/use-cases/_errors/unauthorized-to-invite-error';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';

export async function invite(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    tenantId: z.string().uuid(),
  });

  const bodySchema = z.object({
    email: z.string().email(),
  });

  const { tenantId } = paramsSchema.parse(request.params);
  const { email } = bodySchema.parse(request.body);
  const invitedBy = request.user.sub;

  try {
    const inviteStudentUseCase = makeInviteStudentUseCase();

    const { invitation } = await inviteStudentUseCase.execute({
      email,
      tenantId,
      invitedBy,
    });

    return reply.status(201).send({
      invitation,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof UnauthorizedToInviteError) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof CannotInviteOwnerError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof CannotInviteMentorError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof UserAlreadyMemberOfTenantError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof PendingInvitationAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
