import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeUpdatePhaseTemplateUseCase } from '@/use-cases/_factories/phase-template-factories/make-update-phase-template-use-case';

export async function updatePhaseTemplate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    phaseTemplateId: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    purpose: z.string().min(1).optional(),
    defaultOrder: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
    suggestedDurationDays: z.number().int().positive().optional(),
    defaultMinAccuracy: z.number().min(0).max(100).optional(),
    defaultMinCompletion: z.number().min(0).max(100).optional(),
  });

  const { phaseTemplateId } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  const updatePhaseTemplateUseCase = makeUpdatePhaseTemplateUseCase();

  const { phaseTemplate } = await updatePhaseTemplateUseCase.execute({
    phaseTemplateId,
    ...body,
  });

  return reply.status(200).send({ phaseTemplate });
}
