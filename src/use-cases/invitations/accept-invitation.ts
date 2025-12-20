import { User, InvitationStatus, Role } from '@prisma/client';
import { InvitationsRepository } from '@/repositories/invitations-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { InvitationNotFoundError } from '../_errors/invitation-not-found-error';
import { InvitationExpiredError } from '../_errors/invitation-expired-error';
import { InvitationAlreadyUsedError } from '../_errors/invitation-already-used-error';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

interface AcceptInvitationUseCaseRequest {
  token: string;
  userData?: {
    name: string;
    password: string;
    avatar?: string;
  };
}

interface AcceptInvitationUseCaseResponse {
  user: User;
}

export class AcceptInvitationUseCase {
  constructor(
    private invitationsRepository: InvitationsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    token,
    userData,
  }: AcceptInvitationUseCaseRequest): Promise<AcceptInvitationUseCaseResponse> {
    // 1. Buscar o convite pelo token
    const invitation = await this.invitationsRepository.findByToken(token);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    // 2. Verificar se o convite já foi usado
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new InvitationAlreadyUsedError();
    }

    // 3. Verificar se o convite expirou
    if (new Date() > invitation.expiresAt) {
      await this.invitationsRepository.updateStatus(invitation.id, InvitationStatus.EXPIRED);
      throw new InvitationExpiredError();
    }

    // 4. Verificar se o usuário já existe
    let user = await this.usersRepository.findByEmail(invitation.email);

    // 5. Se o usuário não existe, criar novo usuário
    if (!user) {
      if (!userData) {
        throw new Error('User data is required for new users');
      }

      const password_hash = await hash(userData.password, 6);

      // Criar usuário e adicionar ao tenant em uma transação
      const result = await prisma.$transaction(async (tx) => {
        // Criar o usuário
        const newUser = await tx.user.create({
          data: {
            name: userData.name,
            email: invitation.email,
            password_hash,
            avatar: userData.avatar,
            role: Role.STUDENT,
            isActive: true,
            emailVerified: new Date(), // Email já verificado pelo convite
          },
        });

        // Adicionar ao tenant
        await tx.userTenant.create({
          data: {
            userId: newUser.id,
            tenantId: invitation.tenantId,
            role: invitation.role,
          },
        });

        // Marcar convite como aceito
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: InvitationStatus.ACCEPTED },
        });

        return newUser;
      });

      user = result;
    } else {
      // 6. Se o usuário já existe, apenas adicionar ao tenant
      await prisma.$transaction(async (tx) => {
        // Adicionar ao tenant
        await tx.userTenant.create({
          data: {
            userId: user!.id,
            tenantId: invitation.tenantId,
            role: invitation.role,
          },
        });

        // Marcar convite como aceito
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: InvitationStatus.ACCEPTED },
        });
      });
    }

    return { user };
  }
}
