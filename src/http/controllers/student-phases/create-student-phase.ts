import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateStudentPhaseUseCase } from '@/use-cases/_factories/student-phase-factories/make-create-student-phase-use-case';

export async function createStudentPhase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentId: z.string().uuid(),
  });

  const bodySchema = z.object({
    editalId: z.string().uuid().optional(),
    phaseTemplateId: z.string().uuid().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    purpose: z.string().optional(),
    order: z.number().int().positive(),
    minAccuracyToAdvance: z.number().min(0).max(100).optional(),
    minCompletionToAdvance: z.number().min(0).max(100).optional(),
    suggestedDurationDays: z.number().int().positive().optional(),
  });

  const { studentId } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  const createStudentPhaseUseCase = makeCreateStudentPhaseUseCase();

  const { studentPhase } = await createStudentPhaseUseCase.execute({
    studentId,
    ...body,
  });

  return reply.status(201).send({ studentPhase });
}
