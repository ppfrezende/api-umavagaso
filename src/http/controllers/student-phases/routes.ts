import { FastifyInstance } from 'fastify';
import { createStudentPhase } from './create-student-phase';
import { listStudentPhases } from './list-student-phases';
import { updateStudentPhase } from './update-student-phase';
import { startStudentPhase } from './start-student-phase';
import { completeStudentPhase } from './complete-student-phase';
import { deleteStudentPhase } from './delete-student-phase';
import { requireAuth } from '@/middlewares/auth';

export async function studentPhasesRoutes(app: FastifyInstance) {
  app.post(
    '/students/:studentId/phases',
    { onRequest: [requireAuth] },
    createStudentPhase,
  );
  app.get(
    '/students/:studentId/phases',
    { onRequest: [requireAuth] },
    listStudentPhases,
  );
  app.put(
    '/student-phases/:studentPhaseId',
    { onRequest: [requireAuth] },
    updateStudentPhase,
  );
  app.post(
    '/student-phases/:studentPhaseId/start',
    { onRequest: [requireAuth] },
    startStudentPhase,
  );
  app.post(
    '/student-phases/:studentPhaseId/complete',
    { onRequest: [requireAuth] },
    completeStudentPhase,
  );
  app.delete(
    '/student-phases/:studentPhaseId',
    { onRequest: [requireAuth] },
    deleteStudentPhase,
  );
}
