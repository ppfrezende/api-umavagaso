import { PhaseTemplate } from '@prisma/client';
import { PhaseTemplatesRepository } from '@/repositories/phase-templates-repository';
import { TenantsRepository } from '@/repositories/tenants-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface ListPhaseTemplatesUseCaseRequest {
  tenantId: string;
  activeOnly?: boolean;
}

interface ListPhaseTemplatesUseCaseResponse {
  phaseTemplates: PhaseTemplate[];
}

export class ListPhaseTemplatesUseCase {
  constructor(
    private phaseTemplatesRepository: PhaseTemplatesRepository,
    private tenantsRepository: TenantsRepository,
  ) {}

  async execute({
    tenantId,
    activeOnly = false,
  }: ListPhaseTemplatesUseCaseRequest): Promise<ListPhaseTemplatesUseCaseResponse> {
    const tenant = await this.tenantsRepository.findById(tenantId);

    if (!tenant) {
      throw new ResourceNotFoundError();
    }

    const phaseTemplates = activeOnly
      ? await this.phaseTemplatesRepository.findActiveByTenantId(tenantId)
      : await this.phaseTemplatesRepository.findByTenantId(tenantId);

    return { phaseTemplates };
  }
}
