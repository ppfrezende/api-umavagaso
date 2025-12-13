import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { makeCreateUserUseCase } from '@/use-cases/_factories/user-factories/make-create-user-use-case';
import { UserAlreadyExistsError } from '@/use-cases/_errors/user-already-exists-error';

const createUserBodySchema = z.object({
  clerkId: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role).optional(),
  avatar: z.string().url().optional(),
  tenantId: z.string().uuid().optional(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { clerkId, name, email, role, avatar, tenantId } =
      createUserBodySchema.parse(request.body);

    const createUserUseCase = makeCreateUserUseCase();

    const { user } = await createUserUseCase.execute({
      clerkId,
      name,
      email,
      role,
      avatar,
      tenantId,
    });

    return reply.status(201).send({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        tenantId: user.tenantId,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        error: error.message,
      });
    }

    throw error;
  }
}
