import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeStartStudentPhaseUseCase } from '@/use-cases/_factories/student-phase-factories/make-start-student-phase-use-case';

export async function startStudentPhase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentPhaseId: z.string().uuid(),
  });

  const { studentPhaseId } = paramsSchema.parse(request.params);

  const startStudentPhaseUseCase = makeStartStudentPhaseUseCase();

  const { studentPhase } = await startStudentPhaseUseCase.execute({
    studentPhaseId,
  });

  return reply.status(200).send({ studentPhase });
}
