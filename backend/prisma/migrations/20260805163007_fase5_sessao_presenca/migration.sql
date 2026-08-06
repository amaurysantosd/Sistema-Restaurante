-- CreateEnum
CREATE TYPE "StatusSessao" AS ENUM ('ATIVA', 'ENCERRADA');

-- AlterTable
ALTER TABLE "ClienteFilial" ADD COLUMN     "vipManual" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SessaoPresenca" (
    "id" TEXT NOT NULL,
    "status" "StatusSessao" NOT NULL DEFAULT 'ATIVA',
    "checkInEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaAtividadeEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerradaEm" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,

    CONSTRAINT "SessaoPresenca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessaoPresenca_clienteId_idx" ON "SessaoPresenca"("clienteId");

-- CreateIndex
CREATE INDEX "SessaoPresenca_mesaId_idx" ON "SessaoPresenca"("mesaId");

-- CreateIndex
CREATE INDEX "SessaoPresenca_status_idx" ON "SessaoPresenca"("status");

-- AddForeignKey
ALTER TABLE "SessaoPresenca" ADD CONSTRAINT "SessaoPresenca_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessaoPresenca" ADD CONSTRAINT "SessaoPresenca_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

