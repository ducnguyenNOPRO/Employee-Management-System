/*
  Warnings:

  - You are about to drop the column `is_absent` on the `time_entry` table. All the data in the column will be lost.
  - You are about to drop the column `is_manual` on the `time_entry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,shift_id]` on the table `time_entry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `time_entry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "time_entry_type" AS ENUM ('WORK', 'ABSENT');

-- DropForeignKey
ALTER TABLE "time_entry" DROP CONSTRAINT "time_entry_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "time_entry" DROP CONSTRAINT "time_entry_user_id_fkey";

-- DropForeignKey
ALTER TABLE "time_entry_edit" DROP CONSTRAINT "time_entry_edit_time_entry_id_fkey";

-- DropIndex
DROP INDEX "time_entry_user_id_clock_in_idx";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "time_entry" DROP COLUMN "is_absent",
DROP COLUMN "is_manual",
ADD COLUMN     "type" "time_entry_type" NOT NULL,
ALTER COLUMN "clock_in" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "time_entry_shift_id_idx" ON "time_entry"("shift_id");

-- CreateIndex
CREATE INDEX "time_entry_user_id_idx" ON "time_entry"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "time_entry_user_id_shift_id_key" ON "time_entry"("user_id", "shift_id");

-- CreateIndex
CREATE INDEX "time_entry_edit_time_entry_id_idx" ON "time_entry_edit"("time_entry_id");

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entry_edit" ADD CONSTRAINT "time_entry_edit_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
