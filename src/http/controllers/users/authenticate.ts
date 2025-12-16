import { InvalidCredentialsError } from '@/use-cases/_errors/invalid-credentions-error';
import { makeAuthenticateUseCase } from '@/use-cases/_factories/user-factories/make-authenticate-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const autheticateUseCase = makeAuthenticateUseCase();

    const { user } = await autheticateUseCase.execute({
      email,
      password,
    });

    const { id, name, role, avatar } = user;

    const token = await reply.jwtSign(
      { role: user.role, name: user.name },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '30d',
        },
      },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        //secure: true,
        sameSite: 'lax',
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
        refreshToken,
        id,
        name,
        email,
        role,
        avatar,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
