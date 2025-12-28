import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreatePhaseTemplateUseCase } from '@/use-cases/_factories/phase-template-factories/make-create-phase-template-use-case';

export async function createPhaseTemplate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    tenantId: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    purpose: z.string().min(1),
    defaultOrder: z.number().int().positive(),
    suggestedDurationDays: z.number().int().positive().optional(),
    defaultMinAccuracy: z.number().min(0).max(100).optional(),
    defaultMinCompletion: z.number().min(0).max(100).optional(),
  });

  const { tenantId } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  const createPhaseTemplateUseCase = makeCreatePhaseTemplateUseCase();

  const { phaseTemplate } = await createPhaseTemplateUseCase.execute({
    tenantId,
    ...body,
  });

  return reply.status(201).send({ phaseTemplate });
}
