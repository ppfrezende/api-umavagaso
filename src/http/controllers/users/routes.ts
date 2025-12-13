import { FastifyInstance } from 'fastify';
import { create } from './create';
import { profile } from './profile';
import { clerkWebhook } from './webhook';
import { requireAuth } from '../../../middlewares';

export async function usersRoutes(app: FastifyInstance) {
  // Webhook do Clerk (público, sem autenticação)
  app.post('/webhooks/clerk', clerkWebhook);

  // Rotas autenticadas
  app.post('/users', { preHandler: [requireAuth] }, create);
  app.get('/users/profile', { preHandler: [requireAuth] }, profile);
}
