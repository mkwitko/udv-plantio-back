-- AlterTable
ALTER TABLE "ambulances" ADD COLUMN     "subStatus" TEXT DEFAULT 'Final de Turno',
ALTER COLUMN "status" SET DEFAULT 'FA';
