/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_refresh_token_key" ON "session"("refresh_token");
