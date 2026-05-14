-- AlterTable
ALTER TABLE "leave_request" ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;
