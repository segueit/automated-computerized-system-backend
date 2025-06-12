-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "produce" TEXT NOT NULL,
    "dateOfArrival" TIMESTAMP(3) NOT NULL,
    "numberOfPackages" INTEGER NOT NULL,
    "daysToStore" INTEGER NOT NULL,
    "farmCode" INTEGER NOT NULL,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "ColdStorage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
