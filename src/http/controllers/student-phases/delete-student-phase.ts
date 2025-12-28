import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeDeleteStudentPhaseUseCase } from '@/use-cases/_factories/student-phase-factories/make-delete-student-phase-use-case';

export async function deleteStudentPhase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentPhaseId: z.string().uuid(),
  });

  const { studentPhaseId } = paramsSchema.parse(request.params);

  const deleteStudentPhaseUseCase = makeDeleteStudentPhaseUseCase();

  await deleteStudentPhaseUseCase.execute({ studentPhaseId });

  return reply.status(204).send();
}
