/*
  Warnings:

  - A unique constraint covering the columns `[time_entry_id]` on the table `time_entry_edit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "time_entry" ADD COLUMN     "is_absent" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "time_entry_edit_time_entry_id_key" ON "time_entry_edit"("time_entry_id");

-- AddForeignKey
ALTER TABLE "time_entry_edit" ADD CONSTRAINT "time_entry_edit_time_entry_id_fkey" FOREIGN KEY ("time_entry_id") REFERENCES "time_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
