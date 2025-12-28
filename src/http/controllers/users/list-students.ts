import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeListTenantStudentsUseCase } from '@/use-cases/_factories/user-factories/make-list-tenant-students-use-case';

export async function listStudents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    tenantId: z.string().uuid(),
  });

  const querySchema = z.object({
    isActive: z
      .string()
      .optional()
      .transform((val) => val === 'true')
      .default('true'),
    page: z
      .string()
      .optional()
      .transform((val) => Number(val) || 1)
      .default('1'),
    limit: z
      .string()
      .optional()
      .transform((val) => Number(val) || 10)
      .default('10'),
  });

  const { tenantId } = paramsSchema.parse(request.params);
  const { isActive, page, limit } = querySchema.parse(request.query);

  const listTenantStudentsUseCase = makeListTenantStudentsUseCase();

  const { students, total, totalPages } =
    await listTenantStudentsUseCase.execute({
      tenantId,
      isActive,
      page,
      limit,
    });

  return reply.status(200).send({
    students,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}
