/*
  Warnings:

  - You are about to drop the column `tenantId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenantId_fkey";

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tenantId",
ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "user_tenants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "isExistingUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phases" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "purpose" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "suggestedDurationDays" INTEGER,
    "minAccuracyToAdvance" DECIMAL(5,2),
    "minCompletionToAdvance" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_tenants_userId_idx" ON "user_tenants"("userId");

-- CreateIndex
CREATE INDEX "user_tenants_tenantId_idx" ON "user_tenants"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tenants_userId_tenantId_key" ON "user_tenants"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_email_idx" ON "invitations"("email");

-- CreateIndex
CREATE INDEX "invitations_tenantId_idx" ON "invitations"("tenantId");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE INDEX "phases_tenantId_idx" ON "phases"("tenantId");

-- CreateIndex
CREATE INDEX "phases_isActive_idx" ON "phases"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "phases_tenantId_order_key" ON "phases"("tenantId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_ownerId_key" ON "tenants"("ownerId");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "user_tenants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "user_tenants_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
