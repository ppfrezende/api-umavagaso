import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { CompleteStudentPhaseUseCase } from '@/use-cases/student-phases/complete-student-phase';

export function makeCompleteStudentPhaseUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();

  const useCase = new CompleteStudentPhaseUseCase(studentPhasesRepository);

  return useCase;
}
