/*
  Warnings:

  - You are about to drop the column `used_at` on the `invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "used_at",
ADD COLUMN     "accepted_at" TIMESTAMP(3);
