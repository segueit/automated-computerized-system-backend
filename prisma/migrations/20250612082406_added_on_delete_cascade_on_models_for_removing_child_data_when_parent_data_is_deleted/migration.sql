-- DropForeignKey
ALTER TABLE "Farmer" DROP CONSTRAINT "Farmer_storageId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_storageId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_storageId_fkey";

-- DropForeignKey
ALTER TABLE "UpdateLogs" DROP CONSTRAINT "UpdateLogs_farmerId_fkey";

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "ColdStorage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "ColdStorage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "ColdStorage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateLogs" ADD CONSTRAINT "UpdateLogs_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
