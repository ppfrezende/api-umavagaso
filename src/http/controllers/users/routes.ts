import { FastifyInstance } from 'fastify';
import { create } from './create';
import { verify } from './verify';
import { resendCode } from './resend-code';
import { authenticate } from './authenticate';
import { me } from './me';
import { requireAuth } from '@/middlewares/auth';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
  app.post('/users', create);
  app.post('/users/verify', verify);
  app.post('/users/resend-code', resendCode);
  // Rotas autenticadas
  app.get('/me', { onRequest: [requireAuth] }, me);
}
