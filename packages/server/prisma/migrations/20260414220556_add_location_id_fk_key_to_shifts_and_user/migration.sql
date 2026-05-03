/*
  Warnings:

  - You are about to drop the column `location` on the `shift` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "shift_location_idx";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "shift" DROP COLUMN "location",
ADD COLUMN     "location_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "location_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "shift_location_id_idx" ON "shift"("location_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift" ADD CONSTRAINT "shift_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
