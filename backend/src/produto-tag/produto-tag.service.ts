import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ProdutoTag - tabela de juncao (N:N) entre Produto e Tag.
 * Mesmo padrao de ProdutoIngrediente/ProdutoAlergeno.
 */
@Injectable()
export class ProdutoTagService {
  constructor(private readonly prisma: PrismaService) {}

  async conectar(produtoId: string, tagId: string) {
    const jaConectado = await this.prisma.produtoTag.findUnique({
      where: { produtoId_tagId: { produtoId, tagId } },
    });

    if (jaConectado) {
      throw new BadRequestException('Tag já está conectada a este produto');
    }

    return this.prisma.produtoTag.create({
      data: { produtoId, tagId },
    });
  }

  findAllByProduto(produtoId: string) {
    return this.prisma.produtoTag.findMany({
      where: { produtoId },
      include: { tag: true },
    });
  }

  async desconectar(produtoId: string, tagId: string) {
    const conexao = await this.prisma.produtoTag.findUnique({
      where: { produtoId_tagId: { produtoId, tagId } },
    });

    if (!conexao) {
      throw new NotFoundException('Esta tag não está conectada a este produto');
    }

    return this.prisma.produtoTag.delete({
      where: { produtoId_tagId: { produtoId, tagId } },
    });
  }
}