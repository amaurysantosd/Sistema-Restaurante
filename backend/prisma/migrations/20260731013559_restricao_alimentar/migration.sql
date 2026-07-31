-- CreateTable
CREATE TABLE "ClienteRestricao" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "restricaoId" TEXT NOT NULL,

    CONSTRAINT "ClienteRestricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestricaoAlimentar" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestricaoAlimentar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClienteRestricao_clienteId_idx" ON "ClienteRestricao"("clienteId");

-- CreateIndex
CREATE INDEX "ClienteRestricao_restricaoId_idx" ON "ClienteRestricao"("restricaoId");

-- CreateIndex
CREATE UNIQUE INDEX "ClienteRestricao_clienteId_restricaoId_key" ON "ClienteRestricao"("clienteId", "restricaoId");

-- CreateIndex
CREATE UNIQUE INDEX "RestricaoAlimentar_nome_key" ON "RestricaoAlimentar"("nome");

-- AddForeignKey
ALTER TABLE "ClienteRestricao" ADD CONSTRAINT "ClienteRestricao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteRestricao" ADD CONSTRAINT "ClienteRestricao_restricaoId_fkey" FOREIGN KEY ("restricaoId") REFERENCES "RestricaoAlimentar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
