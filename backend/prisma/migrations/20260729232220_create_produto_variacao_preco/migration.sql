/*
  Warnings:

  - You are about to drop the column `preco` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `precoPromocional` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "preco",
DROP COLUMN "precoPromocional";

-- CreateTable
CREATE TABLE "ProdutoVariacaoPreco" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "ProdutoVariacaoPreco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProdutoVariacaoPreco_produtoId_idx" ON "ProdutoVariacaoPreco"("produtoId");

-- AddForeignKey
ALTER TABLE "ProdutoVariacaoPreco" ADD CONSTRAINT "ProdutoVariacaoPreco_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
