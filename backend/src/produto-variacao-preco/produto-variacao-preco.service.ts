import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoVariacaoPrecoDto } from './dto/create-produto-variacao-preco.dto';
import { UpdateProdutoVariacaoPrecoDto } from './dto/update-produto-variacao-preco.dto';

@Injectable()
export class ProdutoVariacaoPrecoService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria uma variacao de preco, validando que o Produto existe e nao foi
  // removido (soft delete). Se principal=true, desmarca qualquer outra
  // variacao principal do mesmo produto antes de criar esta.
  async create(dto: CreateProdutoVariacaoPrecoDto) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, deletedAt: null },
    });

    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    if (dto.principal === true) {
      await this.desmarcarOutrasPrincipais(dto.produtoId);
    }

    return this.prisma.produtoVariacaoPreco.create({ data: dto });
  }

  // Lista as variacoes de preco de um produto especifico
  findAllByProduto(produtoId: string) {
    return this.prisma.produtoVariacaoPreco.findMany({
      where: { produtoId },
      orderBy: { ordem: 'asc' },
    });
  }

  async findOne(id: string) {
    const variacao = await this.prisma.produtoVariacaoPreco.findUnique({ where: { id } });

    if (!variacao) {
      throw new NotFoundException(`Variação de preço com id ${id} não encontrada`);
    }

    return variacao;
  }

  async update(id: string, dto: UpdateProdutoVariacaoPrecoDto) {
    const variacao = await this.findOne(id);

    if (dto.principal === true) {
      await this.desmarcarOutrasPrincipais(variacao.produtoId, id);
    }

    return this.prisma.produtoVariacaoPreco.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.produtoVariacaoPreco.delete({ where: { id } });
  }

  // Metodo privado: desmarca principal=true de todas as OUTRAS variacoes
  // do mesmo produto, garantindo que so uma fique marcada por vez.
  // "excetoId" evita desmarcar a propria variacao que esta sendo atualizada.
  private async desmarcarOutrasPrincipais(produtoId: string, excetoId?: string) {
    await this.prisma.produtoVariacaoPreco.updateMany({
      where: {
        produtoId,
        id: excetoId ? { not: excetoId } : undefined,
        principal: true,
      },
      data: { principal: false },
    });
  }
}