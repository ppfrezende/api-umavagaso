import { PrismaPhaseTemplatesRepository } from '@/repositories/prisma/prisma-phase-templates-repository';
import { DeletePhaseTemplateUseCase } from '@/use-cases/phase-templates/delete-phase-template';

export function makeDeletePhaseTemplateUseCase() {
  const phaseTemplatesRepository = new PrismaPhaseTemplatesRepository();

  const useCase = new DeletePhaseTemplateUseCase(phaseTemplatesRepository);

  return useCase;
}
