import { Invitation, InvitationStatus } from '@prisma/client';
import { InvitationsRepository } from '@/repositories/invitations-repository';
import { InvitationNotFoundError } from '../_errors/invitation-not-found-error';
import { InvitationAlreadyUsedError } from '../_errors/invitation-already-used-error';

interface CancelInvitationUseCaseRequest {
  invitationId: string;
}

interface CancelInvitationUseCaseResponse {
  invitation: Invitation;
}

export class CancelInvitationUseCase {
  constructor(
    private invitationsRepository: InvitationsRepository,
  ) {}

  async execute({
    invitationId,
  }: CancelInvitationUseCaseRequest): Promise<CancelInvitationUseCaseResponse> {
    // 1. Buscar o convite
    const invitation = await this.invitationsRepository.findById(invitationId);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    // 2. Verificar se o convite já foi aceito
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new InvitationAlreadyUsedError();
    }

    // 3. Cancelar o convite
    const cancelledInvitation = await this.invitationsRepository.updateStatus(
      invitationId,
      InvitationStatus.CANCELLED
    );

    return { invitation: cancelledInvitation };
  }
}
