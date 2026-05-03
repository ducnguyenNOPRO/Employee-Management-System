/*
  Warnings:

  - You are about to drop the column `salary` on the `user` table. All the data in the column will be lost.
  - Added the required column `hourly_rate` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT (floor(random() * 900000) + 100000)::text;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "salary",
ADD COLUMN     "hourly_rate" DECIMAL(3,2) NOT NULL;
