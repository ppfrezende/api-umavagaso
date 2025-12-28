import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PhaseStatus } from '@prisma/client';
import { makeUpdateStudentPhaseUseCase } from '@/use-cases/_factories/student-phase-factories/make-update-student-phase-use-case';

export async function updateStudentPhase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentPhaseId: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    purpose: z.string().optional(),
    order: z.number().int().positive().optional(),
    status: z.nativeEnum(PhaseStatus).optional(),
    currentAccuracy: z.number().min(0).max(100).optional(),
    currentCompletion: z.number().min(0).max(100).optional(),
    minAccuracyToAdvance: z.number().min(0).max(100).optional(),
    minCompletionToAdvance: z.number().min(0).max(100).optional(),
    suggestedDurationDays: z.number().int().positive().optional(),
    startedAt: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    completedAt: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
  });

  const { studentPhaseId } = paramsSchema.parse(request.params);
  const body = bodySchema.parse(request.body);

  const updateStudentPhaseUseCase = makeUpdateStudentPhaseUseCase();

  const { studentPhase } = await updateStudentPhaseUseCase.execute({
    studentPhaseId,
    ...body,
  });

  return reply.status(200).send({ studentPhase });
}
