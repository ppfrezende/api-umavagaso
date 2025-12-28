import { PrismaPhaseTemplatesRepository } from '@/repositories/prisma/prisma-phase-templates-repository';
import { UpdatePhaseTemplateUseCase } from '@/use-cases/phase-templates/update-phase-template';

export function makeUpdatePhaseTemplateUseCase() {
  const phaseTemplatesRepository = new PrismaPhaseTemplatesRepository();

  const useCase = new UpdatePhaseTemplateUseCase(phaseTemplatesRepository);

  return useCase;
}
