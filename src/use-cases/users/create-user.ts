import { User, Role } from '@prisma/client';
import { UsersRepository } from '../../repositories/users-repository';
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error';

interface CreateUserUseCaseRequest {
  clerkId: string;
  name: string;
  email: string;
  role?: Role;
  avatar?: string;
  tenantId?: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    clerkId,
    name,
    email,
    role = Role.STUDENT,
    avatar,
    tenantId,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    // Verifica se já existe um usuário com este clerkId
    const userWithSameClerkId = await this.usersRepository.findByClerkId(
      clerkId,
    );

    if (userWithSameClerkId) {
      throw new UserAlreadyExistsError();
    }

    // Verifica se já existe um usuário com este email
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      clerkId,
      name,
      email,
      role,
      avatar,
      tenant: tenantId ? { connect: { id: tenantId } } : undefined,
    });

    return { user };
  }
}
