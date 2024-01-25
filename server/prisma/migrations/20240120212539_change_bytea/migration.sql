/*
  Warnings:

  - Added the required column `anexo` to the `AnexoAfastamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Afastamento" DROP CONSTRAINT "Afastamento_anexoAfastamentoId_fkey";

-- AlterTable
ALTER TABLE "AnexoAfastamento" ADD COLUMN     "afastamentoId" INTEGER,
ADD COLUMN     "anexo" BYTEA NOT NULL;

-- AddForeignKey
ALTER TABLE "AnexoAfastamento" ADD CONSTRAINT "AnexoAfastamento_afastamentoId_fkey" FOREIGN KEY ("afastamentoId") REFERENCES "Afastamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
