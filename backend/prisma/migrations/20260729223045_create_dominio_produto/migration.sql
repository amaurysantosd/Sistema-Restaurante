-- CreateEnum
CREATE TYPE "TipoMidia" AS ENUM ('FOTO', 'VIDEO');

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "descricaoCurta" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "precoPromocional" DOUBLE PRECISION,
    "tempoPreparo" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ordemExibicao" INTEGER NOT NULL DEFAULT 0,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "vendas" INTEGER NOT NULL DEFAULT 0,
    "ehAlcoolico" BOOLEAN NOT NULL DEFAULT false,
    "teorAlcoolico" DOUBLE PRECISION,
    "ibu" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "filialId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoMidia" (
    "id" TEXT NOT NULL,
    "tipo" "TipoMidia" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "ProdutoMidia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alergeno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Alergeno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoIngrediente" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,

    CONSTRAINT "ProdutoIngrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoAlergeno" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "alergenoId" TEXT NOT NULL,

    CONSTRAINT "ProdutoAlergeno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harmonizacao" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "produtoHarmonizadoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Harmonizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoTag" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProdutoTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Produto_filialId_idx" ON "Produto"("filialId");

-- CreateIndex
CREATE INDEX "Produto_categoriaId_idx" ON "Produto"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_filialId_slug_key" ON "Produto"("filialId", "slug");

-- CreateIndex
CREATE INDEX "ProdutoMidia_produtoId_idx" ON "ProdutoMidia"("produtoId");

-- CreateIndex
CREATE INDEX "Ingrediente_empresaId_idx" ON "Ingrediente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_empresaId_nome_key" ON "Ingrediente"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "Alergeno_empresaId_idx" ON "Alergeno"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Alergeno_empresaId_nome_key" ON "Alergeno"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoIngrediente_produtoId_ingredienteId_key" ON "ProdutoIngrediente"("produtoId", "ingredienteId");

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoAlergeno_produtoId_alergenoId_key" ON "ProdutoAlergeno"("produtoId", "alergenoId");

-- CreateIndex
CREATE UNIQUE INDEX "Harmonizacao_produtoId_produtoHarmonizadoId_key" ON "Harmonizacao"("produtoId", "produtoHarmonizadoId");

-- CreateIndex
CREATE INDEX "Tag_empresaId_idx" ON "Tag"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_empresaId_nome_key" ON "Tag"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoTag_produtoId_tagId_key" ON "ProdutoTag"("produtoId", "tagId");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMidia" ADD CONSTRAINT "ProdutoMidia_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingrediente" ADD CONSTRAINT "Ingrediente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alergeno" ADD CONSTRAINT "Alergeno_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoIngrediente" ADD CONSTRAINT "ProdutoIngrediente_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoIngrediente" ADD CONSTRAINT "ProdutoIngrediente_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingrediente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoAlergeno" ADD CONSTRAINT "ProdutoAlergeno_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoAlergeno" ADD CONSTRAINT "ProdutoAlergeno_alergenoId_fkey" FOREIGN KEY ("alergenoId") REFERENCES "Alergeno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harmonizacao" ADD CONSTRAINT "Harmonizacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harmonizacao" ADD CONSTRAINT "Harmonizacao_produtoHarmonizadoId_fkey" FOREIGN KEY ("produtoHarmonizadoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoTag" ADD CONSTRAINT "ProdutoTag_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoTag" ADD CONSTRAINT "ProdutoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
