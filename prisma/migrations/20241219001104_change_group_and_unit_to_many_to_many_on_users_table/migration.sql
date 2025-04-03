/*
  Warnings:

  - You are about to drop the column `groupId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiLink` to the `ambulances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_groupId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_unitId_fkey";

-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "apiLink" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "groupId",
DROP COLUMN "unitId";

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UnitToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UnitToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- CreateIndex
CREATE INDEX "_UnitToUser_B_index" ON "_UnitToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToUser" ADD CONSTRAINT "_UnitToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToUser" ADD CONSTRAINT "_UnitToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
