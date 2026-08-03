-- CreateEnum
CREATE TYPE "DestinoPreparo" AS ENUM ('COZINHA', 'BAR');

-- CreateEnum
CREATE TYPE "StatusChamado" AS ENUM ('PENDENTE', 'EM_ATENDIMENTO', 'ATENDIDO');

-- CreateEnum
CREATE TYPE "StatusComanda" AS ENUM ('ABERTA', 'FECHADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusItemComanda" AS ENUM ('PENDENTE', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO');

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "destinoPadrao" "DestinoPreparo" NOT NULL DEFAULT 'COZINHA';

-- AlterTable
ALTER TABLE "Filial" ADD COLUMN     "exibirConsumoClienteParaGarcom" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "destino" "DestinoPreparo";

-- CreateTable
CREATE TABLE "TipoChamado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "TipoChamado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chamado" (
    "id" TEXT NOT NULL,
    "status" "StatusChamado" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atendidoEm" TIMESTAMP(3),
    "tipoChamadoId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "atendidoPorUsuarioId" TEXT,

    CONSTRAINT "Chamado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comanda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL DEFAULT 'Principal',
    "status" "StatusComanda" NOT NULL DEFAULT 'ABERTA',
    "abertaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechadaEm" TIMESTAMP(3),
    "mesaId" TEXT NOT NULL,
    "abertaPorUsuarioId" TEXT NOT NULL,

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemComanda" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "status" "StatusItemComanda" NOT NULL DEFAULT 'PENDENTE',
    "destino" "DestinoPreparo" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prontoEm" TIMESTAMP(3),
    "entregueEm" TIMESTAMP(3),
    "comandaId" TEXT NOT NULL,
    "produtoVariacaoPrecoId" TEXT,
    "comboId" TEXT,
    "criadoPorUsuarioId" TEXT NOT NULL,

    CONSTRAINT "ItemComanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumoCliente" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "marcadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,

    CONSTRAINT "ConsumoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TipoChamado_empresaId_idx" ON "TipoChamado"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoChamado_empresaId_nome_key" ON "TipoChamado"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "Chamado_mesaId_idx" ON "Chamado"("mesaId");

-- CreateIndex
CREATE INDEX "Comanda_mesaId_idx" ON "Comanda"("mesaId");

-- CreateIndex
CREATE INDEX "ItemComanda_comandaId_idx" ON "ItemComanda"("comandaId");

-- CreateIndex
CREATE INDEX "ConsumoCliente_clienteId_idx" ON "ConsumoCliente"("clienteId");

-- CreateIndex
CREATE INDEX "ConsumoCliente_mesaId_idx" ON "ConsumoCliente"("mesaId");

-- AddForeignKey
ALTER TABLE "TipoChamado" ADD CONSTRAINT "TipoChamado_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_tipoChamadoId_fkey" FOREIGN KEY ("tipoChamadoId") REFERENCES "TipoChamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_atendidoPorUsuarioId_fkey" FOREIGN KEY ("atendidoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_abertaPorUsuarioId_fkey" FOREIGN KEY ("abertaPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComanda" ADD CONSTRAINT "ItemComanda_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "Comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComanda" ADD CONSTRAINT "ItemComanda_produtoVariacaoPrecoId_fkey" FOREIGN KEY ("produtoVariacaoPrecoId") REFERENCES "ProdutoVariacaoPreco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComanda" ADD CONSTRAINT "ItemComanda_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemComanda" ADD CONSTRAINT "ItemComanda_criadoPorUsuarioId_fkey" FOREIGN KEY ("criadoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoCliente" ADD CONSTRAINT "ConsumoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoCliente" ADD CONSTRAINT "ConsumoCliente_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoCliente" ADD CONSTRAINT "ConsumoCliente_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

