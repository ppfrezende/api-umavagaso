import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { DeleteStudentPhaseUseCase } from '@/use-cases/student-phases/delete-student-phase';

export function makeDeleteStudentPhaseUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();

  const useCase = new DeleteStudentPhaseUseCase(studentPhasesRepository);

  return useCase;
}
