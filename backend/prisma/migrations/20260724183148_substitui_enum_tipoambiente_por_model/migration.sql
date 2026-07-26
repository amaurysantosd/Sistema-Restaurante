/*
  Warnings:

  - You are about to drop the column `tipo` on the `Ambiente` table. All the data in the column will be lost.
  - Added the required column `tipoAmbienteId` to the `Ambiente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ambiente" DROP COLUMN "tipo",
ADD COLUMN     "tipoAmbienteId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TipoAmbiente";

-- CreateTable
CREATE TABLE "TipoAmbiente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "TipoAmbiente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TipoAmbiente_empresaId_idx" ON "TipoAmbiente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAmbiente_empresaId_nome_key" ON "TipoAmbiente"("empresaId", "nome");

-- AddForeignKey
ALTER TABLE "Ambiente" ADD CONSTRAINT "Ambiente_tipoAmbienteId_fkey" FOREIGN KEY ("tipoAmbienteId") REFERENCES "TipoAmbiente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoAmbiente" ADD CONSTRAINT "TipoAmbiente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
