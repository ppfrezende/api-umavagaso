/*
  Warnings:

  - You are about to drop the `phases` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PhaseStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- DropForeignKey
ALTER TABLE "phases" DROP CONSTRAINT "phases_tenantId_fkey";

-- DropTable
DROP TABLE "phases";

-- CreateTable
CREATE TABLE "phase_templates" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "purpose" TEXT NOT NULL,
    "defaultOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "suggestedDurationDays" INTEGER,
    "defaultMinAccuracy" DECIMAL(5,2),
    "defaultMinCompletion" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phase_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_phases" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "editalId" TEXT,
    "phaseTemplateId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "purpose" TEXT,
    "order" INTEGER NOT NULL,
    "status" "PhaseStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "currentAccuracy" DECIMAL(5,2),
    "currentCompletion" DECIMAL(5,2),
    "minAccuracyToAdvance" DECIMAL(5,2),
    "minCompletionToAdvance" DECIMAL(5,2),
    "suggestedDurationDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "phase_templates_tenantId_idx" ON "phase_templates"("tenantId");

-- CreateIndex
CREATE INDEX "phase_templates_isActive_idx" ON "phase_templates"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "phase_templates_tenantId_defaultOrder_key" ON "phase_templates"("tenantId", "defaultOrder");

-- CreateIndex
CREATE INDEX "student_phases_studentId_idx" ON "student_phases"("studentId");

-- CreateIndex
CREATE INDEX "student_phases_editalId_idx" ON "student_phases"("editalId");

-- CreateIndex
CREATE INDEX "student_phases_status_idx" ON "student_phases"("status");

-- CreateIndex
CREATE INDEX "student_phases_phaseTemplateId_idx" ON "student_phases"("phaseTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "student_phases_studentId_editalId_order_key" ON "student_phases"("studentId", "editalId", "order");

-- AddForeignKey
ALTER TABLE "phase_templates" ADD CONSTRAINT "phase_templates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_phases" ADD CONSTRAINT "student_phases_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_phases" ADD CONSTRAINT "student_phases_phaseTemplateId_fkey" FOREIGN KEY ("phaseTemplateId") REFERENCES "phase_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
