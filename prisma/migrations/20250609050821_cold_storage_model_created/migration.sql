-- CreateTable
CREATE TABLE "ColdStorage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codes" INTEGER[],
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColdStorage_pkey" PRIMARY KEY ("id")
);
