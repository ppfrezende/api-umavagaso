import { PhaseTemplate, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PhaseTemplatesRepository } from '../phase-templates-repository';

export class PrismaPhaseTemplatesRepository implements PhaseTemplatesRepository {
  async create(data: Prisma.PhaseTemplateCreateInput): Promise<PhaseTemplate> {
    const phaseTemplate = await prisma.phaseTemplate.create({
      data,
    });

    return phaseTemplate;
  }

  async findById(id: string): Promise<PhaseTemplate | null> {
    const phaseTemplate = await prisma.phaseTemplate.findUnique({
      where: { id },
    });

    return phaseTemplate;
  }

  async findByTenantId(tenantId: string): Promise<PhaseTemplate[]> {
    const phaseTemplates = await prisma.phaseTemplate.findMany({
      where: { tenantId },
      orderBy: {
        defaultOrder: 'asc',
      },
    });

    return phaseTemplates;
  }

  async findByTenantIdAndOrder(tenantId: string, order: number): Promise<PhaseTemplate | null> {
    const phaseTemplate = await prisma.phaseTemplate.findUnique({
      where: {
        tenantId_defaultOrder: {
          tenantId,
          defaultOrder: order,
        },
      },
    });

    return phaseTemplate;
  }

  async findActiveByTenantId(tenantId: string): Promise<PhaseTemplate[]> {
    const phaseTemplates = await prisma.phaseTemplate.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      orderBy: {
        defaultOrder: 'asc',
      },
    });

    return phaseTemplates;
  }

  async update(id: string, data: Prisma.PhaseTemplateUpdateInput): Promise<PhaseTemplate> {
    const phaseTemplate = await prisma.phaseTemplate.update({
      where: { id },
      data,
    });

    return phaseTemplate;
  }

  async delete(id: string): Promise<void> {
    await prisma.phaseTemplate.delete({
      where: { id },
    });
  }
}