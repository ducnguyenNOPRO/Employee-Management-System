-- DropForeignKey
ALTER TABLE "time_entry_edit" DROP CONSTRAINT "time_entry_edit_edited_by_id_fkey";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AddForeignKey
ALTER TABLE "time_entry_edit" ADD CONSTRAINT "time_entry_edit_edited_by_id_fkey" FOREIGN KEY ("edited_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
