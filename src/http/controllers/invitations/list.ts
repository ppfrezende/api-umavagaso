import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeListTenantInvitationsUseCase } from '@/use-cases/_factories/invitation-factories/make-list-tenant-invitations-use-case';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    tenantId: z.string().uuid(),
  });

  const querySchema = z.object({
    onlyPending: z.string().optional().transform(val => val === 'true'),
  });

  const { tenantId } = paramsSchema.parse(request.params);
  const { onlyPending } = querySchema.parse(request.query);

  try {
    const listTenantInvitationsUseCase = makeListTenantInvitationsUseCase();

    const { invitations } = await listTenantInvitationsUseCase.execute({
      tenantId,
      onlyPending,
    });

    return reply.status(200).send({
      invitations,
    });
  } catch (err) {
    throw err;
  }
}
