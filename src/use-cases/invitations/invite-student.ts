import { Invitation, Role } from '@prisma/client';
import { InvitationsRepository } from '@/repositories/invitations-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { UserTenantsRepository } from '@/repositories/user-tenants-repository';
import { TenantsRepository } from '@/repositories/tenants-repository';
import { CannotInviteOwnerError } from '../_errors/cannot-invite-owner-error';
import { CannotInviteMentorError } from '../_errors/cannot-invite-mentor-error';
import { UserAlreadyMemberOfTenantError } from '../_errors/user-already-member-of-tenant-error';
import { PendingInvitationAlreadyExistsError } from '../_errors/pending-invitation-already-exists-error';
import { UnauthorizedToInviteError } from '../_errors/unauthorized-to-invite-error';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';
import { generateInvitationToken, getInvitationTokenExpiry } from '@/lib/generate-invitation-token';
import { mailService } from '@/lib/mail';

interface InviteStudentUseCaseRequest {
  email: string;
  tenantId: string;
  invitedBy: string;
}

interface InviteStudentUseCaseResponse {
  invitation: Invitation;
}

export class InviteStudentUseCase {
  constructor(
    private invitationsRepository: InvitationsRepository,
    private usersRepository: UsersRepository,
    private userTenantsRepository: UserTenantsRepository,
    private tenantsRepository: TenantsRepository,
  ) {}

  async execute({
    email,
    tenantId,
    invitedBy,
  }: InviteStudentUseCaseRequest): Promise<InviteStudentUseCaseResponse> {
    // 1. Verificar se o tenant existe
    const tenant = await this.tenantsRepository.findById(tenantId);
    if (!tenant) {
      throw new ResourceNotFoundError();
    }

    // 2. Verificar se quem está convidando tem permissão (OWNER ou MENTOR)
    const inviterMembership = await this.userTenantsRepository.findByUserIdAndTenantId(
      invitedBy,
      tenantId
    );

    if (!inviterMembership) {
      throw new UnauthorizedToInviteError();
    }

    if (inviterMembership.role !== Role.OWNER && inviterMembership.role !== Role.MENTOR) {
      throw new UnauthorizedToInviteError();
    }

    // 3. Verificar se já existe convite pendente para este email neste tenant
    const pendingInvitation = await this.invitationsRepository.findPendingByEmailAndTenantId(
      email,
      tenantId
    );

    if (pendingInvitation) {
      throw new PendingInvitationAlreadyExistsError();
    }

    // 4. Verificar se o usuário já existe no sistema
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      // 4a. Se for OWNER, não pode ser convidado
      if (existingUser.role === Role.OWNER) {
        throw new CannotInviteOwnerError();
      }

      // 4b. Se for MENTOR, não pode ser convidado
      if (existingUser.role === Role.MENTOR) {
        throw new CannotInviteMentorError();
      }

      // 4c. Verificar se já é membro deste tenant
      const existingMembership = await this.userTenantsRepository.findByUserIdAndTenantId(
        existingUser.id,
        tenantId
      );

      if (existingMembership) {
        throw new UserAlreadyMemberOfTenantError();
      }
    }

    // 5. Criar o convite
    const token = generateInvitationToken();
    const expiresAt = getInvitationTokenExpiry();

    const invitation = await this.invitationsRepository.create({
      email,
      token,
      expiresAt,
      isExistingUser: !!existingUser,
      role: Role.STUDENT,
      tenant: {
        connect: { id: tenantId }
      },
      inviter: {
        connect: { id: invitedBy }
      }
    });

    // 6. Buscar dados do inviter para o email
    const inviter = await this.usersRepository.findById(invitedBy);

    // 7. Enviar email de convite apropriado
    if (existingUser) {
      await mailService.sendExistingUserInvitationEmail(
        email,
        existingUser.name,
        tenant.name,
        inviter!.name,
        token
      );
    } else {
      await mailService.sendInvitationEmail(
        email,
        tenant.name,
        inviter!.name,
        token
      );
    }

    return { invitation };
  }
}
