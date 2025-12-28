import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeListStudentPhasesUseCase } from '@/use-cases/_factories/student-phase-factories/make-list-student-phases-use-case';

export async function listStudentPhases(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    studentId: z.string().uuid(),
  });

  const querySchema = z.object({
    editalId: z.string().uuid().optional(),
  });

  const { studentId } = paramsSchema.parse(request.params);
  const { editalId } = querySchema.parse(request.query);

  const listStudentPhasesUseCase = makeListStudentPhasesUseCase();

  const { studentPhases } = await listStudentPhasesUseCase.execute({
    studentId,
    editalId,
  });

  return reply.status(200).send({ studentPhases });
}
