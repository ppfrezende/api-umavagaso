import { User, Role } from '@prisma/client';
import { UsersRepository } from '../../repositories/users-repository';
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error';
import { hash } from 'bcryptjs';
import { generateVerificationToken, getVerificationTokenExpiry } from '@/lib/generate-verification-token';
import { mailService } from '@/lib/mail';

interface CreateUserUseCaseRequest {
  id?: string;
  name: string;
  email: string;
  role?: Role;
  password: string;
  avatar?: string;
  tenantId?: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    role = Role.MENTOR,
    password,
    avatar,
    tenantId,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationTokenExpiry();

    // STEP 1: Tentar enviar o email PRIMEIRO
    // Se falhar, lança erro e não cria o usuário
    await mailService.sendVerificationEmail(email, name, verificationToken);

    // STEP 2: Se o email foi enviado com sucesso, criar o usuário
    // Usuário começa inativo até verificar o email
    const user = await this.usersRepository.create({
      id,
      name,
      email,
      role,
      password_hash,
      avatar,
      isActive: false, // Usuário inativo até verificar email
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
      tenant: tenantId ? { connect: { id: tenantId } } : undefined,
    });

    return { user };
  }
}
