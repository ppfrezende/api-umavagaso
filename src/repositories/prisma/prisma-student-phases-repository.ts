import { StudentPhase, Prisma, PhaseStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { StudentPhasesRepository } from '../student-phases-repository';

export class PrismaStudentPhasesRepository implements StudentPhasesRepository {
  async create(data: Prisma.StudentPhaseCreateInput): Promise<StudentPhase> {
    const studentPhase = await prisma.studentPhase.create({
      data,
    });

    return studentPhase;
  }

  async findById(id: string): Promise<StudentPhase | null> {
    const studentPhase = await prisma.studentPhase.findUnique({
      where: { id },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhase;
  }

  async findByStudentId(studentId: string): Promise<StudentPhase[]> {
    const studentPhases = await prisma.studentPhase.findMany({
      where: { studentId },
      orderBy: {
        order: 'asc',
      },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhases;
  }

  async findByStudentIdAndEditalId(studentId: string, editalId: string): Promise<StudentPhase[]> {
    const studentPhases = await prisma.studentPhase.findMany({
      where: {
        studentId,
        editalId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhases;
  }

  async findByStudentIdEditalIdAndOrder(
    studentId: string,
    editalId: string | null,
    order: number
  ): Promise<StudentPhase | null> {
    const studentPhase = await prisma.studentPhase.findUnique({
      where: {
        studentId_editalId_order: {
          studentId,
          editalId,
          order,
        },
      },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhase;
  }

  async findCurrentPhase(studentId: string, editalId: string): Promise<StudentPhase | null> {
    const studentPhase = await prisma.studentPhase.findFirst({
      where: {
        studentId,
        editalId,
        status: PhaseStatus.IN_PROGRESS,
      },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhase;
  }

  async update(id: string, data: Prisma.StudentPhaseUpdateInput): Promise<StudentPhase> {
    const studentPhase = await prisma.studentPhase.update({
      where: { id },
      data,
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhase;
  }

  async updateStatus(id: string, status: PhaseStatus): Promise<StudentPhase> {
    const studentPhase = await prisma.studentPhase.update({
      where: { id },
      data: { status },
      include: {
        phaseTemplate: true,
      },
    });

    return studentPhase;
  }

  async delete(id: string): Promise<void> {
    await prisma.studentPhase.delete({
      where: { id },
    });
  }
}
