import { PrismaStudentPhasesRepository } from '@/repositories/prisma/prisma-student-phases-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ListStudentPhasesUseCase } from '@/use-cases/student-phases/list-student-phases';

export function makeListStudentPhasesUseCase() {
  const studentPhasesRepository = new PrismaStudentPhasesRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new ListStudentPhasesUseCase(studentPhasesRepository, usersRepository);

  return useCase;
}
