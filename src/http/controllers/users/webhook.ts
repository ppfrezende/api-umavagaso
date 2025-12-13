import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { makeCreateUserUseCase } from '@/use-cases/_factories/user-factories/make-create-user-use-case';
import { UserAlreadyExistsError } from '@/use-cases/_errors/user-already-exists-error';

const clerkWebhookBodySchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
        id: z.string(),
      }),
    ),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    image_url: z.string().nullable(),
    public_metadata: z
      .object({
        role: z.nativeEnum(Role).optional(),
        tenantId: z.string().optional(),
      })
      .optional(),
  }),
});

export async function clerkWebhook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = clerkWebhookBodySchema.parse(request.body);

    // Processa apenas eventos de criação de usuário
    if (body.type === 'user.created') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = body.data;

      const primaryEmail = email_addresses[0]?.email_address;

      if (!primaryEmail) {
        return reply.status(400).send({
          error: 'No email found for user',
        });
      }

      const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';

      const createUserUseCase = makeCreateUserUseCase();

      await createUserUseCase.execute({
        clerkId: id,
        email: primaryEmail,
        name,
        avatar: image_url || undefined,
        role: public_metadata?.role,
        tenantId: public_metadata?.tenantId,
      });

      return reply.status(201).send({
        message: 'User created successfully',
      });
    }

    // Outros tipos de eventos podem ser processados aqui
    return reply.status(200).send({
      message: 'Webhook received',
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        error: error.message,
      });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Invalid webhook payload',
        details: error.errors,
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      error: 'Internal server error',
    });
  }
}
