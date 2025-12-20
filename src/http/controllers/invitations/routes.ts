import { FastifyInstance } from 'fastify';
import { requireAuth } from '@/middlewares/auth';
import { invite } from './invite';
import { accept } from './accept';
import { resend } from './resend';
import { cancel } from './cancel';
import { list } from './list';

export async function invitationsRoutes(app: FastifyInstance) {
  // Rota pública para aceitar convite
  app.post('/invitations/:token/accept', accept);

  // Rotas autenticadas
  app.post('/tenants/:tenantId/invitations', { onRequest: [requireAuth] }, invite);
  app.get('/tenants/:tenantId/invitations', { onRequest: [requireAuth] }, list);
  app.post('/invitations/:invitationId/resend', { onRequest: [requireAuth] }, resend);
  app.delete('/invitations/:invitationId', { onRequest: [requireAuth] }, cancel);
}
