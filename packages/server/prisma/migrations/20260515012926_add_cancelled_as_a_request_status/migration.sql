-- AlterEnum
ALTER TYPE "LeaveRequestStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;
