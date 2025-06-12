/*
  Warnings:

  - Added the required column `qrCode` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "qrCode" TEXT NOT NULL;
