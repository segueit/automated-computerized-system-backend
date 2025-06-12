/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ColdStorage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ColdStorage_email_key" ON "ColdStorage"("email");
