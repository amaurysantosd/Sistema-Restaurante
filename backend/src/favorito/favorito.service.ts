import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritoService {
  constructor(private readonly prisma: PrismaService) {}

  async favoritar(clienteId: string, produtoId: string) {
    // Valida que o Cliente do token realmente existe no banco -- protege
    // contra tokens desatualizados/de testes antigos, evitando um erro
    // 500 cru de foreign key (como ja aconteceu) e devolvendo uma
    // mensagem clara em vez disso.
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado — faça login novamente');
    }

    const produto = await this.prisma.produto.findFirst({
      where: { id: produtoId, deletedAt: null },
    });

    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    const jaFavoritado = await this.prisma.favorito.findUnique({
      where: { clienteId_produtoId: { clienteId, produtoId } },
    });

    if (jaFavoritado) {
      throw new BadRequestException('Produto já está nos favoritos');
    }

    return this.prisma.favorito.create({ data: { clienteId, produtoId } });
  }

  findAllByCliente(clienteId: string) {
    return this.prisma.favorito.findMany({
      where: { clienteId },
      include: { produto: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async desfavoritar(clienteId: string, produtoId: string) {
    const favorito = await this.prisma.favorito.findUnique({
      where: { clienteId_produtoId: { clienteId, produtoId } },
    });

    if (!favorito) {
      throw new NotFoundException('Este produto não está nos favoritos');
    }

    return this.prisma.favorito.delete({
      where: { clienteId_produtoId: { clienteId, produtoId } },
    });
  }
}