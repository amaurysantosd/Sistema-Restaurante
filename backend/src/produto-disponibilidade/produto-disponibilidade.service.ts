import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDisponibilidadeDto } from './dto/create-produto-disponibilidade.dto';
import { UpdateProdutoDisponibilidadeDto } from './dto/update-produto-disponibilidade.dto';

@Injectable()
export class ProdutoDisponibilidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProdutoDisponibilidadeDto) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, deletedAt: null },
    });

    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    return this.prisma.produtoDisponibilidade.create({ data: dto });
  }

  // Lista TODAS as regras de disponibilidade de um produto (pode ter varias)
  findAllByProduto(produtoId: string) {
    return this.prisma.produtoDisponibilidade.findMany({ where: { produtoId } });
  }

  async findOne(id: string) {
    const regra = await this.prisma.produtoDisponibilidade.findUnique({ where: { id } });

    if (!regra) {
      throw new NotFoundException(`Regra de disponibilidade com id ${id} não encontrada`);
    }

    return regra;
  }

  async update(id: string, dto: UpdateProdutoDisponibilidadeDto) {
    await this.findOne(id);
    return this.prisma.produtoDisponibilidade.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.produtoDisponibilidade.delete({ where: { id } });
  }
}