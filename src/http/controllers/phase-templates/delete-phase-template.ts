import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeDeletePhaseTemplateUseCase } from '@/use-cases/_factories/phase-template-factories/make-delete-phase-template-use-case';

export async function deletePhaseTemplate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    phaseTemplateId: z.string().uuid(),
  });

  const { phaseTemplateId } = paramsSchema.parse(request.params);

  const deletePhaseTemplateUseCase = makeDeletePhaseTemplateUseCase();

  await deletePhaseTemplateUseCase.execute({ phaseTemplateId });

  return reply.status(204).send();
}
