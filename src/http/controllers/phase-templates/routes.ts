import { FastifyInstance } from 'fastify';
import { createPhaseTemplate } from './create-phase-template';
import { listPhaseTemplates } from './list-phase-templates';
import { updatePhaseTemplate } from './update-phase-template';
import { deletePhaseTemplate } from './delete-phase-template';
import { requireAuth } from '@/middlewares/auth';

export async function phaseTemplatesRoutes(app: FastifyInstance) {
  app.post(
    '/tenants/:tenantId/phase-templates',
    { onRequest: [requireAuth] },
    createPhaseTemplate,
  );
  app.get(
    '/tenants/:tenantId/phase-templates',
    { onRequest: [requireAuth] },
    listPhaseTemplates,
  );
  app.put(
    '/phase-templates/:phaseTemplateId',
    { onRequest: [requireAuth] },
    updatePhaseTemplate,
  );
  app.delete(
    '/phase-templates/:phaseTemplateId',
    { onRequest: [requireAuth] },
    deletePhaseTemplate,
  );
}
