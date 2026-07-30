import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * ProdutoIngrediente - tabela de juncao (N:N) entre Produto e Ingrediente.
 *
 * Diferente dos modulos "completos" do sistema, este NAO tem DTO de criacao
 * tradicional, porque a tabela nao possui campos proprios alem das duas
 * chaves estrangeiras (produtoId + ingredienteId).
 *
 * A operacao aqui e CONECTAR ou DESCONECTAR um ingrediente de um produto,
 * nao "criar um registro com dados" -- por isso os metodos recebem os dois
 * IDs diretamente, sem um DTO.
 */
@Injectable()
export class ProdutoIngredienteService {
  constructor(private readonly prisma: PrismaService) {}

  async conectar(produtoId: string, ingredienteId: string) {
    const jaConectado = await this.prisma.produtoIngrediente.findUnique({
      where: { produtoId_ingredienteId: { produtoId, ingredienteId } },
    });

    if (jaConectado) {
      throw new BadRequestException('Ingrediente já está conectado a este produto');
    }

    return this.prisma.produtoIngrediente.create({
      data: { produtoId, ingredienteId },
    });
  }

  // Lista os ingredientes conectados a um produto, trazendo os dados
  // do Ingrediente (nome) via include, nao so o id cru da tabela de juncao.
  findAllByProduto(produtoId: string) {
    return this.prisma.produtoIngrediente.findMany({
      where: { produtoId },
      include: { ingrediente: true },
    });
  }

  async desconectar(produtoId: string, ingredienteId: string) {
    const conexao = await this.prisma.produtoIngrediente.findUnique({
      where: { produtoId_ingredienteId: { produtoId, ingredienteId } },
    });

    if (!conexao) {
      throw new NotFoundException('Este ingrediente não está conectado a este produto');
    }

    return this.prisma.produtoIngrediente.delete({
      where: { produtoId_ingredienteId: { produtoId, ingredienteId } },
    });
  }
}