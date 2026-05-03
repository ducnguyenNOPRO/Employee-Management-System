-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "shift" ADD COLUMN     "notes" VARCHAR(255);
