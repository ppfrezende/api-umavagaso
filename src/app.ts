import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { ZodError } from 'zod';

export const app = fastify();

app.register(
  cors,
  {
    exposedHeaders: ['x-total-count'],
  } /*{
  origin: true,
  credentials: true,
}*/,
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
