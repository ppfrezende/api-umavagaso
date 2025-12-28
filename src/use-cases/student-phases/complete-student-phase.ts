import { StudentPhase, PhaseStatus } from '@prisma/client';
import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface CompleteStudentPhaseUseCaseRequest {
  studentPhaseId: string;
}

interface CompleteStudentPhaseUseCaseResponse {
  studentPhase: StudentPhase;
}

export class CompleteStudentPhaseUseCase {
  constructor(private studentPhasesRepository: StudentPhasesRepository) {}

  async execute({
    studentPhaseId,
  }: CompleteStudentPhaseUseCaseRequest): Promise<CompleteStudentPhaseUseCaseResponse> {
    const studentPhase = await this.studentPhasesRepository.findById(studentPhaseId);

    if (!studentPhase) {
      throw new ResourceNotFoundError();
    }

    if (studentPhase.status !== PhaseStatus.IN_PROGRESS) {
      throw new Error('Only phases in progress can be completed');
    }

    if (studentPhase.minAccuracyToAdvance && studentPhase.currentAccuracy) {
      const currentAccuracy = Number(studentPhase.currentAccuracy);
      const minAccuracy = Number(studentPhase.minAccuracyToAdvance);

      if (currentAccuracy < minAccuracy) {
        throw new Error('Current accuracy is below the minimum required to advance');
      }
    }

    if (studentPhase.minCompletionToAdvance && studentPhase.currentCompletion) {
      const currentCompletion = Number(studentPhase.currentCompletion);
      const minCompletion = Number(studentPhase.minCompletionToAdvance);

      if (currentCompletion < minCompletion) {
        throw new Error('Current completion is below the minimum required to advance');
      }
    }

    const updatedPhase = await this.studentPhasesRepository.update(studentPhaseId, {
      status: PhaseStatus.COMPLETED,
      completedAt: new Date(),
    });

    return { studentPhase: updatedPhase };
  }
}
