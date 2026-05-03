/*
  Warnings:

  - Made the column `shift_id` on table `time_entry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "time_entry" ALTER COLUMN "shift_id" SET NOT NULL;
