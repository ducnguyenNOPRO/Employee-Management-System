-- DropIndex
DROP INDEX "time_entry_edit_time_entry_id_key";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;
