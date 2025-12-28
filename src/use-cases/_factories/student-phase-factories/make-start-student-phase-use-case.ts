import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { StartStudentPhaseUseCase } from '@/use-cases/student-phases/start-student-phase';

export function makeStartStudentPhaseUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();

  const useCase = new StartStudentPhaseUseCase(studentPhasesRepository);

  return useCase;
}
