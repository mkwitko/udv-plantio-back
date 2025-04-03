/*
  Warnings:

  - The `cellphone` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `companyId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "cellphone",
ADD COLUMN     "cellphone" TEXT[];

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "cellphone" TEXT[];

-- AlterTable
ALTER TABLE "units" ADD COLUMN     "cellphone" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "companyId";

-- CreateTable
CREATE TABLE "_CompanyToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToUser_B_index" ON "_CompanyToUser"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToUser" ADD CONSTRAINT "_CompanyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToUser" ADD CONSTRAINT "_CompanyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
