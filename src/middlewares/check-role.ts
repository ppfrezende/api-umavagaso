import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth } from '@clerk/fastify';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export function checkRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId: clerkId } = getAuth(request);

    if (!clerkId) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { tenant: true },
      });

      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found in the system',
        });
      }

      if (!user.isActive) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Your account is inactive',
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to access this resource',
        });
      }

      request.userId = user.id;
      request.clerkId = clerkId;
      request.userRole = user.role;
      request.user = user;
    } catch (_error) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to verify user permissions',
      });
    }
  };
}
