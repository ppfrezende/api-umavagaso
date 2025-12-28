import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { env } from './env';
import { ZodError } from 'zod';
import { usersRoutes } from './http/controllers/users/routes';
import { invitationsRoutes } from './http/controllers/invitations/routes';
import { phaseTemplatesRoutes } from './http/controllers/phase-templates/routes';
import { studentPhasesRoutes } from './http/controllers/student-phases/routes';

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

// Registrar cookie para gerenciamento de cookies
app.register(cookie);

// Registrar JWT para autenticação
app.register(jwt, {
  secret: env.JWT_SECRET,
});

// Registrar rotas
app.register(usersRoutes);
app.register(invitationsRoutes);
app.register(phaseTemplatesRoutes);
app.register(studentPhasesRoutes);

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
