import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { ZodError } from 'zod';
import { clerkPlugin } from '@clerk/fastify';
import { usersRoutes } from './http/controllers/users/routes';

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

// Registrar rotas
app.register(usersRoutes);

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
