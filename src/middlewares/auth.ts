import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth } from '@clerk/fastify';

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { isAuthenticated, userId } = getAuth(request);

  if (!isAuthenticated || !userId) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource',
    });
  }

  request.userId = userId;
}
