import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetUserProfileUseCase } from '@/use-cases/_factories/user-factories/make-get-user-profile-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
      userId: request.userId!,
    });

    return reply.status(200).send({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        tenantId: user.tenantId,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        error: error.message,
      });
    }

    throw error;
  }
}
