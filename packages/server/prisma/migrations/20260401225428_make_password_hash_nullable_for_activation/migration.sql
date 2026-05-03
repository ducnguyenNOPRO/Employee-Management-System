/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type]` on the table `leave_balance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "leave_balance_user_id_idx" ON "leave_balance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balance_user_id_type_key" ON "leave_balance"("user_id", "type");
