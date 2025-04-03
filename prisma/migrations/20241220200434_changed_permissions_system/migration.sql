/*
  Warnings:

  - You are about to drop the column `cellphone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cellphone",
DROP COLUMN "email",
DROP COLUMN "role",
ADD COLUMN     "birthday" TEXT NOT NULL,
ADD COLUMN     "permissions" TEXT[];
