import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface DeleteStudentPhaseUseCaseRequest {
  studentPhaseId: string;
}

export class DeleteStudentPhaseUseCase {
  constructor(private studentPhasesRepository: StudentPhasesRepository) {}

  async execute({ studentPhaseId }: DeleteStudentPhaseUseCaseRequest): Promise<void> {
    const studentPhase = await this.studentPhasesRepository.findById(studentPhaseId);

    if (!studentPhase) {
      throw new ResourceNotFoundError();
    }

    await this.studentPhasesRepository.delete(studentPhaseId);
  }
}
