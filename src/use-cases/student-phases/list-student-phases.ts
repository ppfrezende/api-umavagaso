import { StudentPhase } from '@prisma/client';
import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface ListStudentPhasesUseCaseRequest {
  studentId: string;
  editalId?: string;
}

interface ListStudentPhasesUseCaseResponse {
  studentPhases: StudentPhase[];
}

export class ListStudentPhasesUseCase {
  constructor(
    private studentPhasesRepository: StudentPhasesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    studentId,
    editalId,
  }: ListStudentPhasesUseCaseRequest): Promise<ListStudentPhasesUseCaseResponse> {
    const student = await this.usersRepository.findById(studentId);

    if (!student) {
      throw new ResourceNotFoundError();
    }

    const studentPhases = editalId
      ? await this.studentPhasesRepository.findByStudentIdAndEditalId(studentId, editalId)
      : await this.studentPhasesRepository.findByStudentId(studentId);

    return { studentPhases };
  }
}
