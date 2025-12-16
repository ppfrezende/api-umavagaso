import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export function checkRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verifica o token JWT no header Authorization
      await request.jwtVerify();

      // O userId vem do payload do JWT
      const { sub: userId } = request.user as { sub: string };

      if (!userId) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid token payload',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
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
      request.userRole = user.role;
      request.userData = user;
    } catch (error) {
      if (error instanceof Error && error.name === 'UnauthorizedError') {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'You must be logged in to access this resource',
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to verify user permissions',
      });
    }
  };
}
