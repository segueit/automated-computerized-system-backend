-- CreateTable
CREATE TABLE "UpdateLogs" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "logs" JSONB NOT NULL,
    "remarks" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateLogs_farmerId_key" ON "UpdateLogs"("farmerId");

-- AddForeignKey
ALTER TABLE "UpdateLogs" ADD CONSTRAINT "UpdateLogs_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
