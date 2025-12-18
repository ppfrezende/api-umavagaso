import { FastifyReply, FastifyRequest } from 'fastify';

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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

    request.userId = userId;
  } catch (_error) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource',
    });
  }
}
