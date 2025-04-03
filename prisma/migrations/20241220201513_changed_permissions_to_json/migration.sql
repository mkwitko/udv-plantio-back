/*
  Warnings:

  - Changed the type of `permissions` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "permissions",
ADD COLUMN     "permissions" JSONB NOT NULL;
