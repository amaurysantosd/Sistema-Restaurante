/*
  Warnings:

  - A unique constraint covering the columns `[comboId,produtoId]` on the table `ComboItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ComboItem_comboId_produtoId_key" ON "ComboItem"("comboId", "produtoId");
