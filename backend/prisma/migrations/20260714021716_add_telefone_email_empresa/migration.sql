/*
  Warnings:

  - Added the required column `email` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;
