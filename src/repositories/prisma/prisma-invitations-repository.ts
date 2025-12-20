import { Invitation, InvitationStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { InvitationsRepository } from '../invitations-repository';

export class PrismaInvitationsRepository implements InvitationsRepository {
  async create(data: Prisma.InvitationCreateInput): Promise<Invitation> {
    const invitation = await prisma.invitation.create({
      data,
    });

    return invitation;
  }

  async findById(id: string): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    return invitation;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    return invitation;
  }

  async findByEmailAndTenantId(email: string, tenantId: string): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitation;
  }

  async findPendingByEmailAndTenantId(email: string, tenantId: string): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
        tenantId,
        status: InvitationStatus.PENDING,
      },
    });

    return invitation;
  }

  async findManyByTenantId(tenantId: string): Promise<Invitation[]> {
    const invitations = await prisma.invitation.findMany({
      where: { tenantId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations;
  }

  async findManyPendingByTenantId(tenantId: string): Promise<Invitation[]> {
    const invitations = await prisma.invitation.findMany({
      where: {
        tenantId,
        status: InvitationStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations;
  }

  async update(id: string, data: Prisma.InvitationUpdateInput): Promise<Invitation> {
    const invitation = await prisma.invitation.update({
      where: { id },
      data,
    });

    return invitation;
  }

  async updateStatus(id: string, status: InvitationStatus): Promise<Invitation> {
    const invitation = await prisma.invitation.update({
      where: { id },
      data: { status },
    });

    return invitation;
  }

  async delete(id: string): Promise<void> {
    await prisma.invitation.delete({
      where: { id },
    });
  }
}
