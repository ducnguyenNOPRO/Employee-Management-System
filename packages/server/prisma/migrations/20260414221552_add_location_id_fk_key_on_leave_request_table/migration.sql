/*
  Warnings:

  - Added the required column `location_id` to the `leave_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "leave_request_approver_id_idx";

-- AlterTable
ALTER TABLE "leave_request" ADD COLUMN     "location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- CreateIndex
CREATE INDEX "leave_request_location_id_idx" ON "leave_request"("location_id");

-- AddForeignKey
ALTER TABLE "leave_request" ADD CONSTRAINT "leave_request_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
