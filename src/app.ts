import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { ZodError } from 'zod';
import { clerkClient, clerkPlugin } from '@clerk/fastify';
import { requireAuth } from './middlewares/auth';
import { checkRole } from './middlewares/check-role';

export const app = fastify({ logger: true });

app.register(
  cors,
  {
    exposedHeaders: ['x-total-count'],
  } /*{
  origin: true,
  credentials: true,
}*/,
);

app.register(clerkPlugin);

app.get('/protected', { preHandler: [requireAuth] }, async (request, reply) => {
  try {
    const user = await clerkClient.users.getUser(request.userId!);

    return reply.send({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    app.log.error(error);
    return reply.code(500).send({ error: 'Failed to retrieve user' });
  }
});

app.get(
  '/admin-only',
  { preHandler: [checkRole(['admin'])] },
  async (request, reply) => {
    return reply.send({
      message: 'Welcome admin!',
      userId: request.userId,
      role: request.userRole,
    });
  },
);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error' });
});
