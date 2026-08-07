-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('PARTICULAR', 'SAZONAL');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'COMPARECEU', 'NAO_COMPARECEU');

-- CreateEnum
CREATE TYPE "StatusListaEspera" AS ENUM ('AGUARDANDO', 'CHAMADO', 'ATENDIDO', 'DESISTIU');

-- CreateEnum
CREATE TYPE "ModalidadePagamentoReserva" AS ENUM ('PIX_MANUAL', 'GATEWAY');

-- CreateEnum
CREATE TYPE "FinalidadeRecebimento" AS ENUM ('COMANDA', 'RESERVA', 'EVENTO', 'GERAL');

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "modalidadePagamentoReserva" "ModalidadePagamentoReserva" NOT NULL DEFAULT 'PIX_MANUAL';

-- AlterTable
ALTER TABLE "Filial" ADD COLUMN     "reservaExigeCadastro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservaPercentualSinalPadrao" DOUBLE PRECISION NOT NULL DEFAULT 50;

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "filialId" TEXT,
    "ambienteId" TEXT,
    "valorEntrada" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "quantidadePessoas" INTEGER NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "nomeConvidado" TEXT,
    "telefoneConvidado" TEXT,
    "valorOrcamento" DOUBLE PRECISION,
    "percentualSinal" DOUBLE PRECISION,
    "valorSinal" DOUBLE PRECISION,
    "sinalPago" BOOLEAN NOT NULL DEFAULT false,
    "toleranciaAte" TIMESTAMP(3),
    "filialId" TEXT NOT NULL,
    "ambienteId" TEXT,
    "mesaId" TEXT,
    "eventoId" TEXT,
    "clienteId" TEXT,
    "criadoPorUsuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaEspera" (
    "id" TEXT NOT NULL,
    "quantidadePessoas" INTEGER NOT NULL,
    "status" "StatusListaEspera" NOT NULL DEFAULT 'AGUARDANDO',
    "nomeConvidado" TEXT,
    "telefoneConvidado" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chamadoEm" TIMESTAMP(3),
    "atendidoEm" TIMESTAMP(3),
    "filialId" TEXT NOT NULL,
    "clienteId" TEXT,

    CONSTRAINT "ListaEspera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContaRecebimento" (
    "id" TEXT NOT NULL,
    "finalidade" "FinalidadeRecebimento" NOT NULL,
    "chavePix" TEXT NOT NULL,
    "nomeFavorecido" TEXT NOT NULL,
    "nomeBanco" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "ContaRecebimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evento_filialId_idx" ON "Evento"("filialId");

-- CreateIndex
CREATE INDEX "Evento_ambienteId_idx" ON "Evento"("ambienteId");

-- CreateIndex
CREATE INDEX "Reserva_filialId_idx" ON "Reserva"("filialId");

-- CreateIndex
CREATE INDEX "Reserva_clienteId_idx" ON "Reserva"("clienteId");

-- CreateIndex
CREATE INDEX "Reserva_eventoId_idx" ON "Reserva"("eventoId");

-- CreateIndex
CREATE INDEX "Reserva_dataHora_idx" ON "Reserva"("dataHora");

-- CreateIndex
CREATE INDEX "ListaEspera_filialId_idx" ON "ListaEspera"("filialId");

-- CreateIndex
CREATE INDEX "ListaEspera_status_idx" ON "ListaEspera"("status");

-- CreateIndex
CREATE INDEX "ContaRecebimento_empresaId_idx" ON "ContaRecebimento"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "ContaRecebimento_empresaId_finalidade_key" ON "ContaRecebimento"("empresaId", "finalidade");

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_ambienteId_fkey" FOREIGN KEY ("ambienteId") REFERENCES "Ambiente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_criadoPorUsuarioId_fkey" FOREIGN KEY ("criadoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaRecebimento" ADD CONSTRAINT "ContaRecebimento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

