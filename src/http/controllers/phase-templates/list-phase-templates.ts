import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeListPhaseTemplatesUseCase } from '@/use-cases/_factories/phase-template-factories/make-list-phase-templates-use-case';

export async function listPhaseTemplates(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    tenantId: z.string().uuid(),
  });

  const querySchema = z.object({
    activeOnly: z
      .string()
      .optional()
      .transform((val) => val === 'true')
      .default('false'),
  });

  const { tenantId } = paramsSchema.parse(request.params);
  const { activeOnly } = querySchema.parse(request.query);

  const listPhaseTemplatesUseCase = makeListPhaseTemplatesUseCase();

  const { phaseTemplates } = await listPhaseTemplatesUseCase.execute({
    tenantId,
    activeOnly,
  });

  return reply.status(200).send({ phaseTemplates });
}
