import { FastifyReply, FastifyRequest } from 'fastify';
import { clerkClient, getAuth } from '@clerk/fastify';

export function checkRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      });
    }

    try {
      const user = await clerkClient.users.getUser(userId);
      const userRole = user.publicMetadata?.role as string | undefined;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to access this resource',
        });
      }

      request.userId = userId;
      request.userRole = userRole;
    } catch (_error) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to verify user permissions',
      });
    }
  };
}
