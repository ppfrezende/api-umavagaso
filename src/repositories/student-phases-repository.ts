import { StudentPhase, Prisma, PhaseStatus } from '@prisma/client';

export interface StudentPhasesRepository {
  create(data: Prisma.StudentPhaseCreateInput): Promise<StudentPhase>;
  findById(id: string): Promise<StudentPhase | null>;
  findByStudentId(studentId: string): Promise<StudentPhase[]>;
  findByStudentIdAndEditalId(studentId: string, editalId: string): Promise<StudentPhase[]>;
  findByStudentIdEditalIdAndOrder(
    studentId: string,
    editalId: string | null,
    order: number
  ): Promise<StudentPhase | null>;
  findCurrentPhase(studentId: string, editalId: string): Promise<StudentPhase | null>;
  update(id: string, data: Prisma.StudentPhaseUpdateInput): Promise<StudentPhase>;
  updateStatus(id: string, status: PhaseStatus): Promise<StudentPhase>;
  delete(id: string): Promise<void>;
}
