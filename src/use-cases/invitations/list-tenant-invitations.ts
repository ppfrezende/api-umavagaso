import { Invitation } from '@prisma/client';
import { InvitationsRepository } from '@/repositories/invitations-repository';

interface ListTenantInvitationsUseCaseRequest {
  tenantId: string;
  onlyPending?: boolean;
}

interface ListTenantInvitationsUseCaseResponse {
  invitations: Invitation[];
}

export class ListTenantInvitationsUseCase {
  constructor(
    private invitationsRepository: InvitationsRepository,
  ) {}

  async execute({
    tenantId,
    onlyPending = false,
  }: ListTenantInvitationsUseCaseRequest): Promise<ListTenantInvitationsUseCaseResponse> {
    let invitations: Invitation[];

    if (onlyPending) {
      invitations = await this.invitationsRepository.findManyPendingByTenantId(tenantId);
    } else {
      invitations = await this.invitationsRepository.findManyByTenantId(tenantId);
    }

    return { invitations };
  }
}
