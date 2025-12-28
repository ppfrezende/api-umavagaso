import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { UpdateStudentPhaseUseCase } from '@/use-cases/student-phases/update-student-phase';

export function makeUpdateStudentPhaseUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();

  const useCase = new UpdateStudentPhaseUseCase(studentPhasesRepository);

  return useCase;
}
