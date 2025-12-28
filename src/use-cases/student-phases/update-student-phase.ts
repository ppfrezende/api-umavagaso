import { StudentPhase, PhaseStatus } from '@prisma/client';
import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface UpdateStudentPhaseUseCaseRequest {
  studentPhaseId: string;
  name?: string;
  description?: string;
  purpose?: string;
  order?: number;
  status?: PhaseStatus;
  currentAccuracy?: number;
  currentCompletion?: number;
  minAccuracyToAdvance?: number;
  minCompletionToAdvance?: number;
  suggestedDurationDays?: number;
  startedAt?: Date;
  completedAt?: Date;
}

interface UpdateStudentPhaseUseCaseResponse {
  studentPhase: StudentPhase;
}

export class UpdateStudentPhaseUseCase {
  constructor(private studentPhasesRepository: StudentPhasesRepository) {}

  async execute({
    studentPhaseId,
    name,
    description,
    purpose,
    order,
    status,
    currentAccuracy,
    currentCompletion,
    minAccuracyToAdvance,
    minCompletionToAdvance,
    suggestedDurationDays,
    startedAt,
    completedAt,
  }: UpdateStudentPhaseUseCaseRequest): Promise<UpdateStudentPhaseUseCaseResponse> {
    const existingPhase = await this.studentPhasesRepository.findById(studentPhaseId);

    if (!existingPhase) {
      throw new ResourceNotFoundError();
    }

    if (order !== undefined && order !== existingPhase.order) {
      const phaseWithNewOrder = await this.studentPhasesRepository.findByStudentIdEditalIdAndOrder(
        existingPhase.studentId,
        existingPhase.editalId,
        order
      );

      if (phaseWithNewOrder) {
        throw new Error('A student phase with this order already exists for this student and edital');
      }
    }

    const studentPhase = await this.studentPhasesRepository.update(studentPhaseId, {
      name,
      description,
      purpose,
      order,
      status,
      currentAccuracy,
      currentCompletion,
      minAccuracyToAdvance,
      minCompletionToAdvance,
      suggestedDurationDays,
      startedAt,
      completedAt,
    });

    return { studentPhase };
  }
}
