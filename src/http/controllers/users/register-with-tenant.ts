import { UserAlreadyExistsError } from '@/use-cases/_errors/user-already-exists-error';
import { makeRegisterWithTenantUseCase } from '@/use-cases/_factories/user-factories/make-register-with-tenant-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function registerWithTenant(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    user: z.object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
      avatar: z.string().url().optional(),
    }),
    tenant: z.object({
      name: z.string().min(2, 'Nome da organização deve ter pelo menos 2 caracteres'),
      description: z.string().optional(),
      logo: z.string().url().optional(),
    }),
  });

  const { user: userData, tenant: tenantData } = bodySchema.parse(request.body);

  try {
    const registerWithTenantUseCase = makeRegisterWithTenantUseCase();

    const { user, tenant } = await registerWithTenantUseCase.execute({
      user: userData,
      tenant: tenantData,
    });

    return reply.status(201).send({
      user: {
        ...user,
        password_hash: undefined,
        emailVerificationToken: undefined,
      },
      tenant: {
        ...tenant,
      },
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
