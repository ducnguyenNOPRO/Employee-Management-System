-- DropIndex
DROP INDEX "leave_request_location_id_idx";

-- DropIndex
DROP INDEX "leave_request_requester_id_idx";

-- DropIndex
DROP INDEX "leave_request_start_date_idx";

-- DropIndex
DROP INDEX "leave_request_status_idx";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- CreateIndex
CREATE INDEX "leave_request_location_id_status_status_priority_start_date_idx" ON "leave_request"("location_id", "status", "status_priority", "start_date", "created_at");

-- CreateIndex
CREATE INDEX "leave_request_location_id_requester_id_status_status_priori_idx" ON "leave_request"("location_id", "requester_id", "status", "status_priority", "start_date", "created_at");

-- CreateIndex
CREATE INDEX "leave_request_requester_id_status_created_at_idx" ON "leave_request"("requester_id", "status", "created_at");
