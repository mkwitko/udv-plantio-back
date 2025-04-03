/*
  Warnings:

  - Added the required column `groupId` to the `ambulances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `ambulances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
