import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ProdutoHarmonizacao - auto-relacionamento (Produto se liga a outro Produto).
 * Assim como os demais modulos de juncao, nao tem DTO tradicional -- a
 * operacao e conectar/desconectar dois produtos existentes.
 *
 * Diferente de ProdutoIngrediente/ProdutoAlergeno/ProdutoTag, aqui os dois
 * lados da relacao apontam para a MESMA tabela (Produto), entao usamos os
 * nomes de relacao ("ProdutoPrincipal"/"ProdutoHarmonizado") definidos no
 * schema para o Prisma nao ficar ambiguo sobre qual e qual no include.
 */
@Injectable()
export class ProdutoHarmonizacaoService {
  constructor(private readonly prisma: PrismaService) {}

  /* uma validação que só faz sentido em auto-relacionamentos: impedir que um produto 
  seja marcado como harmonizando "consigo mesmo", o que não faria sentido de negócio nenhum. */
  async conectar(produtoId: string, produtoHarmonizadoId: string) {
    if (produtoId === produtoHarmonizadoId) {
      throw new BadRequestException('Um produto não pode harmonizar consigo mesmo');
    }

    const jaConectado = await this.prisma.harmonizacao.findUnique({
      where: { produtoId_produtoHarmonizadoId: { produtoId, produtoHarmonizadoId } },
    });

    if (jaConectado) {
      throw new BadRequestException('Esta harmonização já existe');
    }

    return this.prisma.harmonizacao.create({
      data: { produtoId, produtoHarmonizadoId },
    });
  }

  // Lista os produtos que ESTE produto recomenda (lado "principal" da relacao)
  findAllByProduto(produtoId: string) {
    return this.prisma.harmonizacao.findMany({
      where: { produtoId },
      include: { produtoHarmonizado: true },
    });
  }

  async desconectar(produtoId: string, produtoHarmonizadoId: string) {
    const conexao = await this.prisma.harmonizacao.findUnique({
      where: { produtoId_produtoHarmonizadoId: { produtoId, produtoHarmonizadoId } },
    });

    if (!conexao) {
      throw new NotFoundException('Esta harmonização não existe');
    }

    return this.prisma.harmonizacao.delete({
      where: { produtoId_produtoHarmonizadoId: { produtoId, produtoHarmonizadoId } },
    });
  }
}