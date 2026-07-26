-- CreateEnum
CREATE TYPE "TipoAmbiente" AS ENUM ('INTERNO', 'EXTERNO', 'VIP', 'FUMANTES');

-- CreateTable
CREATE TABLE "Ambiente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoAmbiente" NOT NULL,
    "andar" INTEGER,
    "capacidade" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filialId" TEXT NOT NULL,

    CONSTRAINT "Ambiente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ambiente_filialId_idx" ON "Ambiente"("filialId");

-- AddForeignKey
ALTER TABLE "Ambiente" ADD CONSTRAINT "Ambiente_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
