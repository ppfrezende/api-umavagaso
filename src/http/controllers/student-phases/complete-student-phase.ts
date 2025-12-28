import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCompleteStudentPhaseUseCase } from '@/use-cases/_factories/student-phase-factories/make-complete-student-phase-use-case';

export async function completeStudentPhase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentPhaseId: z.string().uuid(),
  });

  const { studentPhaseId } = paramsSchema.parse(request.params);

  const completeStudentPhaseUseCase = makeCompleteStudentPhaseUseCase();

  const { studentPhase } = await completeStudentPhaseUseCase.execute({ studentPhaseId });

  return reply.status(200).send({ studentPhase });
}
