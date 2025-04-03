/*
  Warnings:

  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatId` to the `ambulances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `companyId` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cellphone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cpf` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "chatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId",
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "companyId" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "cellphone" SET NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL;

-- DropTable
DROP TABLE "Roles";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
