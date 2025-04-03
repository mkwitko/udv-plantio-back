/*
  Warnings:

  - The `permissions` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ambulances" DROP CONSTRAINT "ambulances_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ambulances" DROP CONSTRAINT "ambulances_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ambulances" DROP CONSTRAINT "ambulances_unitId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_ambulanceId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_companyId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_groupId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_unitId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_companyId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_companyId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_groupId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "permissions",
ADD COLUMN     "permissions" TEXT[];

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_ambulanceId_fkey" FOREIGN KEY ("ambulanceId") REFERENCES "ambulances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
