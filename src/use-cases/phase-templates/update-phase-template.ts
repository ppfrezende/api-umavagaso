import { PhaseTemplate } from '@prisma/client';
import { PhaseTemplatesRepository } from '@/repositories/phase-templates-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface UpdatePhaseTemplateUseCaseRequest {
  phaseTemplateId: string;
  name?: string;
  description?: string;
  purpose?: string;
  defaultOrder?: number;
  isActive?: boolean;
  suggestedDurationDays?: number;
  defaultMinAccuracy?: number;
  defaultMinCompletion?: number;
}

interface UpdatePhaseTemplateUseCaseResponse {
  phaseTemplate: PhaseTemplate;
}

export class UpdatePhaseTemplateUseCase {
  constructor(private phaseTemplatesRepository: PhaseTemplatesRepository) {}

  async execute({
    phaseTemplateId,
    name,
    description,
    purpose,
    defaultOrder,
    isActive,
    suggestedDurationDays,
    defaultMinAccuracy,
    defaultMinCompletion,
  }: UpdatePhaseTemplateUseCaseRequest): Promise<UpdatePhaseTemplateUseCaseResponse> {
    const existingTemplate = await this.phaseTemplatesRepository.findById(phaseTemplateId);

    if (!existingTemplate) {
      throw new ResourceNotFoundError();
    }

    if (defaultOrder !== undefined && defaultOrder !== existingTemplate.defaultOrder) {
      const templateWithNewOrder = await this.phaseTemplatesRepository.findByTenantIdAndOrder(
        existingTemplate.tenantId,
        defaultOrder
      );

      if (templateWithNewOrder) {
        throw new Error('A phase template with this order already exists for this tenant');
      }
    }

    const phaseTemplate = await this.phaseTemplatesRepository.update(phaseTemplateId, {
      name,
      description,
      purpose,
      defaultOrder,
      isActive,
      suggestedDurationDays,
      defaultMinAccuracy,
      defaultMinCompletion,
    });

    return { phaseTemplate };
  }
}
