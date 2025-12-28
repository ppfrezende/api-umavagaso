import { PrismaPhaseTemplatesRepository } from '@/repositories/prisma/prisma-phase-templates-repository';
import { PrismaTenantsRepository } from '@/repositories/prisma/prisma-tenants-repository';
import { CreatePhaseTemplateUseCase } from '@/use-cases/phase-templates/create-phase-template';

export function makeCreatePhaseTemplateUseCase() {
  const phaseTemplatesRepository = new PrismaPhaseTemplatesRepository();
  const tenantsRepository = new PrismaTenantsRepository();

  const useCase = new CreatePhaseTemplateUseCase(phaseTemplatesRepository, tenantsRepository);

  return useCase;
}
