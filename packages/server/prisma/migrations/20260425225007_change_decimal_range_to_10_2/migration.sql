-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "hourly_rate" SET DATA TYPE DECIMAL(10,2);
