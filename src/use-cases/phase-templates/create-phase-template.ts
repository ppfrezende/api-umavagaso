import { PhaseTemplate } from '@prisma/client';
import { PhaseTemplatesRepository } from '@/repositories/phase-templates-repository';
import { TenantsRepository } from '@/repositories/tenants-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface CreatePhaseTemplateUseCaseRequest {
  tenantId: string;
  name: string;
  description?: string;
  purpose: string;
  defaultOrder: number;
  suggestedDurationDays?: number;
  defaultMinAccuracy?: number;
  defaultMinCompletion?: number;
}

interface CreatePhaseTemplateUseCaseResponse {
  phaseTemplate: PhaseTemplate;
}

export class CreatePhaseTemplateUseCase {
  constructor(
    private phaseTemplatesRepository: PhaseTemplatesRepository,
    private tenantsRepository: TenantsRepository,
  ) {}

  async execute({
    tenantId,
    name,
    description,
    purpose,
    defaultOrder,
    suggestedDurationDays,
    defaultMinAccuracy,
    defaultMinCompletion,
  }: CreatePhaseTemplateUseCaseRequest): Promise<CreatePhaseTemplateUseCaseResponse> {
    const tenant = await this.tenantsRepository.findById(tenantId);

    if (!tenant) {
      throw new ResourceNotFoundError();
    }

    const existingTemplateWithOrder = await this.phaseTemplatesRepository.findByTenantIdAndOrder(
      tenantId,
      defaultOrder
    );

    if (existingTemplateWithOrder) {
      throw new Error('A phase template with this order already exists for this tenant');
    }

    const phaseTemplate = await this.phaseTemplatesRepository.create({
      name,
      description,
      purpose,
      defaultOrder,
      suggestedDurationDays,
      defaultMinAccuracy,
      defaultMinCompletion,
      tenant: {
        connect: { id: tenantId },
      },
    });

    return { phaseTemplate };
  }
}
