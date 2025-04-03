/*
  Warnings:

  - Added the required column `name` to the `ambulances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "unitId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
