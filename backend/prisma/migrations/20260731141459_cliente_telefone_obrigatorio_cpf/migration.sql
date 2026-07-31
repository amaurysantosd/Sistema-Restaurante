/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Made the column `telefone` on table `Cliente` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "aceitaMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cpf" TEXT,
ALTER COLUMN "telefone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");
