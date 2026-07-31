-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "googleId" TEXT,
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteFilial" (
    "id" TEXT NOT NULL,
    "pontosFidelidade" INTEGER NOT NULL DEFAULT 0,
    "saldoCashback" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "primeiraVisita" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "filialId" TEXT NOT NULL,

    CONSTRAINT "ClienteFilial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefone_key" ON "Cliente"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_googleId_key" ON "Cliente"("googleId");

-- CreateIndex
CREATE INDEX "ClienteFilial_clienteId_idx" ON "ClienteFilial"("clienteId");

-- CreateIndex
CREATE INDEX "ClienteFilial_filialId_idx" ON "ClienteFilial"("filialId");

-- CreateIndex
CREATE UNIQUE INDEX "ClienteFilial_clienteId_filialId_key" ON "ClienteFilial"("clienteId", "filialId");

-- AddForeignKey
ALTER TABLE "ClienteFilial" ADD CONSTRAINT "ClienteFilial_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteFilial" ADD CONSTRAINT "ClienteFilial_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
