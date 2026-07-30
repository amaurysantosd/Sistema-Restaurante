import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoMidiaDto } from './dto/create-produto-midia.dto';
import { UpdateProdutoMidiaDto } from './dto/update-produto-midia.dto';

/**
 * ProdutoMidia — CRUD da galeria de fotos/videos do produto.
 * Segue o mesmo padrao de ProdutoVariacaoPreco: apenas uma midia pode
 * estar marcada como principal (capa) por produto, garantido aqui no
 * Service via desmarcarOutrasPrincipais (o banco nao garante isso sozinho).
 */
@Injectable()
export class ProdutoMidiaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProdutoMidiaDto) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, deletedAt: null },
    });

    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    if (dto.principal === true) {
      await this.desmarcarOutrasPrincipais(dto.produtoId);
    }

    return this.prisma.produtoMidia.create({ data: dto });
  }

  findAllByProduto(produtoId: string) {
    return this.prisma.produtoMidia.findMany({
      where: { produtoId },
      orderBy: { ordem: 'asc' },
    });
  }

  async findOne(id: string) {
    const midia = await this.prisma.produtoMidia.findUnique({ where: { id } });

    if (!midia) {
      throw new NotFoundException(`Mídia com id ${id} não encontrada`);
    }

    return midia;
  }

  async update(id: string, dto: UpdateProdutoMidiaDto) {
    const midia = await this.findOne(id);

    if (dto.principal === true) {
      await this.desmarcarOutrasPrincipais(midia.produtoId, id);
    }

    return this.prisma.produtoMidia.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.produtoMidia.delete({ where: { id } });
  }

  // Desmarca principal=true de todas as OUTRAS midias do mesmo produto,
  // garantindo que so uma fique marcada por vez.
  private async desmarcarOutrasPrincipais(produtoId: string, excetoId?: string) {
    await this.prisma.produtoMidia.updateMany({
      where: {
        produtoId,
        id: excetoId ? { not: excetoId } : undefined,
        principal: true,
      },
      data: { principal: false },
    });
  }
}