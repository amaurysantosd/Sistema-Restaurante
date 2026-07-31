-- CreateTable
CREATE TABLE "Favorito" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoVisita" (
    "id" TEXT NOT NULL,
    "dataVisita" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,
    "mesaId" TEXT,

    CONSTRAINT "HistoricoVisita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorito_clienteId_idx" ON "Favorito"("clienteId");

-- CreateIndex
CREATE INDEX "Favorito_produtoId_idx" ON "Favorito"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_clienteId_produtoId_key" ON "Favorito"("clienteId", "produtoId");

-- CreateIndex
CREATE INDEX "HistoricoVisita_clienteId_idx" ON "HistoricoVisita"("clienteId");

-- CreateIndex
CREATE INDEX "HistoricoVisita_filialId_idx" ON "HistoricoVisita"("filialId");

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoVisita" ADD CONSTRAINT "HistoricoVisita_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoVisita" ADD CONSTRAINT "HistoricoVisita_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoVisita" ADD CONSTRAINT "HistoricoVisita_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
