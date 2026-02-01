/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expires_at]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "session_expiresAt_key";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "expiresAt",
DROP COLUMN "refreshToken",
ADD COLUMN     "expires_at" TIMESTAMP NOT NULL,
ADD COLUMN     "refresh_token" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "session_expires_at_key" ON "session"("expires_at");
