import { PrismaPhaseTemplatesRepository } from '@/repositories/prisma/prisma-phase-templates-repository';
import { PrismaTenantsRepository } from '@/repositories/prisma/prisma-tenants-repository';
import { ListPhaseTemplatesUseCase } from '@/use-cases/phase-templates/list-phase-templates';

export function makeListPhaseTemplatesUseCase() {
  const phaseTemplatesRepository = new PrismaPhaseTemplatesRepository();
  const tenantsRepository = new PrismaTenantsRepository();

  const useCase = new ListPhaseTemplatesUseCase(phaseTemplatesRepository, tenantsRepository);

  return useCase;
}
