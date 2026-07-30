import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ProdutoAlergeno - tabela de juncao (N:N) entre Produto e Alergeno.
 * Mesmo padrao de ProdutoIngrediente: conectar/desconectar, sem DTO proprio.
 */
@Injectable()
export class ProdutoAlergenoService {
  constructor(private readonly prisma: PrismaService) {}

  async conectar(produtoId: string, alergenoId: string) {
    const jaConectado = await this.prisma.produtoAlergeno.findUnique({
      where: { produtoId_alergenoId: { produtoId, alergenoId } },
    });

    if (jaConectado) {
      throw new BadRequestException('Alérgeno já está conectado a este produto');
    }

    return this.prisma.produtoAlergeno.create({
      data: { produtoId, alergenoId },
    });
  }

  findAllByProduto(produtoId: string) {
    return this.prisma.produtoAlergeno.findMany({
      where: { produtoId },
      include: { alergeno: true },
    });
  }

  async desconectar(produtoId: string, alergenoId: string) {
    const conexao = await this.prisma.produtoAlergeno.findUnique({
      where: { produtoId_alergenoId: { produtoId, alergenoId } },
    });

    if (!conexao) {
      throw new NotFoundException('Este alérgeno não está conectado a este produto');
    }

    return this.prisma.produtoAlergeno.delete({
      where: { produtoId_alergenoId: { produtoId, alergenoId } },
    });
  }
}