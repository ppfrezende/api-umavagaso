import { StudentPhase } from '@prisma/client';
import { StudentPhasesRepository } from '@/repositories/student-phases-repository';
import { PhaseTemplatesRepository } from '@/repositories/phase-templates-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface CreateStudentPhaseUseCaseRequest {
  studentId: string;
  editalId?: string;
  phaseTemplateId?: string;
  name: string;
  description?: string;
  purpose?: string;
  order: number;
  minAccuracyToAdvance?: number;
  minCompletionToAdvance?: number;
  suggestedDurationDays?: number;
}

interface CreateStudentPhaseUseCaseResponse {
  studentPhase: StudentPhase;
}

export class CreateStudentPhaseUseCase {
  constructor(
    private studentPhasesRepository: StudentPhasesRepository,
    private phaseTemplatesRepository: PhaseTemplatesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    studentId,
    editalId,
    phaseTemplateId,
    name,
    description,
    purpose,
    order,
    minAccuracyToAdvance,
    minCompletionToAdvance,
    suggestedDurationDays,
  }: CreateStudentPhaseUseCaseRequest): Promise<CreateStudentPhaseUseCaseResponse> {
    const student = await this.usersRepository.findById(studentId);

    if (!student) {
      throw new ResourceNotFoundError();
    }

    if (phaseTemplateId) {
      const phaseTemplate = await this.phaseTemplatesRepository.findById(phaseTemplateId);
      if (!phaseTemplate) {
        throw new ResourceNotFoundError();
      }
    }

    const existingPhase = await this.studentPhasesRepository.findByStudentIdEditalIdAndOrder(
      studentId,
      editalId || null,
      order
    );

    if (existingPhase) {
      throw new Error('A student phase with this order already exists for this student and edital');
    }

    const studentPhase = await this.studentPhasesRepository.create({
      name,
      description,
      purpose,
      order,
      minAccuracyToAdvance,
      minCompletionToAdvance,
      suggestedDurationDays,
      editalId,
      student: {
        connect: { id: studentId },
      },
      ...(phaseTemplateId && {
        phaseTemplate: {
          connect: { id: phaseTemplateId },
        },
      }),
    });

    return { studentPhase };
  }
}
