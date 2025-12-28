import { StudentPhase, PhaseStatus } from '@prisma/client';
import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface StartStudentPhaseUseCaseRequest {
  studentPhaseId: string;
}

interface StartStudentPhaseUseCaseResponse {
  studentPhase: StudentPhase;
}

export class StartStudentPhaseUseCase {
  constructor(private studentPhasesRepository: StudentPhasesRepository) {}

  async execute({
    studentPhaseId,
  }: StartStudentPhaseUseCaseRequest): Promise<StartStudentPhaseUseCaseResponse> {
    const studentPhase = await this.studentPhasesRepository.findById(studentPhaseId);

    if (!studentPhase) {
      throw new ResourceNotFoundError();
    }

    if (studentPhase.status !== PhaseStatus.NOT_STARTED) {
      throw new Error('This phase has already been started or completed');
    }

    const updatedPhase = await this.studentPhasesRepository.update(studentPhaseId, {
      status: PhaseStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return { studentPhase: updatedPhase };
  }
}
