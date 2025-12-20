import { Invitation, InvitationStatus } from '@prisma/client';
import { InvitationsRepository } from '@/repositories/invitations-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { TenantsRepository } from '@/repositories/tenants-repository';
import { InvitationNotFoundError } from '../_errors/invitation-not-found-error';
import { InvitationAlreadyUsedError } from '../_errors/invitation-already-used-error';
import { generateInvitationToken, getInvitationTokenExpiry } from '@/lib/generate-invitation-token';
import { mailService } from '@/lib/mail';

interface ResendInvitationUseCaseRequest {
  invitationId: string;
}

interface ResendInvitationUseCaseResponse {
  invitation: Invitation;
}

export class ResendInvitationUseCase {
  constructor(
    private invitationsRepository: InvitationsRepository,
    private usersRepository: UsersRepository,
    private tenantsRepository: TenantsRepository,
  ) {}

  async execute({
    invitationId,
  }: ResendInvitationUseCaseRequest): Promise<ResendInvitationUseCaseResponse> {
    // 1. Buscar o convite
    const invitation = await this.invitationsRepository.findById(invitationId);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    // 2. Verificar se o convite já foi aceito
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new InvitationAlreadyUsedError();
    }

    // 3. Gerar novo token e nova data de expiração
    const newToken = generateInvitationToken();
    const newExpiresAt = getInvitationTokenExpiry();

    // 4. Atualizar o convite
    const updatedInvitation = await this.invitationsRepository.update(invitationId, {
      token: newToken,
      expiresAt: newExpiresAt,
      status: InvitationStatus.PENDING,
    });

    // 5. Buscar dados necessários para o email
    const tenant = await this.tenantsRepository.findById(invitation.tenantId);
    const inviter = await this.usersRepository.findById(invitation.invitedBy);
    const existingUser = await this.usersRepository.findByEmail(invitation.email);

    // 6. Reenviar email de convite
    if (existingUser) {
      await mailService.sendExistingUserInvitationEmail(
        invitation.email,
        existingUser.name,
        tenant!.name,
        inviter!.name,
        newToken
      );
    } else {
      await mailService.sendInvitationEmail(
        invitation.email,
        tenant!.name,
        inviter!.name,
        newToken
      );
    }

    return { invitation: updatedInvitation };
  }
}
