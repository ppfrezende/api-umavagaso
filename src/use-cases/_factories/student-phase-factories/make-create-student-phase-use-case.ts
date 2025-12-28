import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { PrismaPhaseTemplatesRepository } from '@/repositories/prisma/prisma-phase-templates-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateStudentPhaseUseCase } from '@/use-cases/student-phases/create-student-phase';

export function makeCreateStudentPhaseUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();
  const phaseTemplatesRepository = new PrismaPhaseTemplatesRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CreateStudentPhaseUseCase(
    studentPhasesRepository,
    phaseTemplatesRepository,
    usersRepository
  );

  return useCase;
}
