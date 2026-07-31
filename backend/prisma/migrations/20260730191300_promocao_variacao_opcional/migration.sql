-- AlterTable
ALTER TABLE "Promocao" ADD COLUMN     "produtoVariacaoPrecoId" TEXT;

-- CreateIndex
CREATE INDEX "Promocao_produtoVariacaoPrecoId_idx" ON "Promocao"("produtoVariacaoPrecoId");

-- AddForeignKey
ALTER TABLE "Promocao" ADD CONSTRAINT "Promocao_produtoVariacaoPrecoId_fkey" FOREIGN KEY ("produtoVariacaoPrecoId") REFERENCES "ProdutoVariacaoPreco"("id") ON DELETE SET NULL ON UPDATE CASCADE;
