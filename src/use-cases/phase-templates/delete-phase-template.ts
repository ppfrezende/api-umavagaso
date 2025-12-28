import { PhaseTemplatesRepository } from '@/repositories/phase-templates-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface DeletePhaseTemplateUseCaseRequest {
  phaseTemplateId: string;
}

export class DeletePhaseTemplateUseCase {
  constructor(private phaseTemplatesRepository: PhaseTemplatesRepository) {}

  async execute({ phaseTemplateId }: DeletePhaseTemplateUseCaseRequest): Promise<void> {
    const phaseTemplate = await this.phaseTemplatesRepository.findById(phaseTemplateId);

    if (!phaseTemplate) {
      throw new ResourceNotFoundError();
    }

    await this.phaseTemplatesRepository.delete(phaseTemplateId);
  }
}
