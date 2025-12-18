import { User, Tenant, Role } from '@prisma/client';
import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error';
import { hash } from 'bcryptjs';
import { generateVerificationToken, getVerificationTokenExpiry } from '@/lib/generate-verification-token';
import { mailService } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

interface RegisterWithTenantUseCaseRequest {
  user: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
  };
  tenant: {
    name: string;
    description?: string;
    logo?: string;
  };
}

interface RegisterWithTenantUseCaseResponse {
  user: User;
  tenant: Tenant;
}

export class RegisterWithTenantUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    user: userData,
    tenant: tenantData,
  }: RegisterWithTenantUseCaseRequest): Promise<RegisterWithTenantUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(userData.email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(userData.password, 6);
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationTokenExpiry();

    // Enviar email de verificação primeiro
    await mailService.sendVerificationEmail(
      userData.email,
      userData.name,
      verificationToken
    );

    // Criar Tenant e User em uma transação atômica
    const result = await prisma.$transaction(async (tx) => {
      // Criar o tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantData.name,
          description: tenantData.description,
          logo: tenantData.logo,
          owner: {
            create: {
              name: userData.name,
              email: userData.email,
              password_hash,
              avatar: userData.avatar,
              role: Role.OWNER,
              isActive: false, // Inativo até verificar email
              emailVerificationToken: verificationToken,
              emailVerificationExpiry: verificationExpiry,
            },
          },
        },
        include: {
          owner: true,
        },
      });

      // Criar a relação UserTenant (owner como membro do tenant)
      await tx.userTenant.create({
        data: {
          userId: tenant.owner.id,
          tenantId: tenant.id,
          role: Role.OWNER,
        },
      });

      return { user: tenant.owner, tenant };
    });

    return result;
  }
}
