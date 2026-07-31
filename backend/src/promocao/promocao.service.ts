import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromocaoDto } from './dto/create-promocao.dto';
import { UpdatePromocaoDto } from './dto/update-promocao.dto';

@Injectable()
export class PromocaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromocaoDto) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, deletedAt: null },
    });

    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    // Se uma variacao especifica foi informada, valida que ela pertence
    // a este mesmo produto (evita ligar promocao a variacao de outro produto)
    if (dto.produtoVariacaoPrecoId) {
      const variacao = await this.prisma.produtoVariacaoPreco.findUnique({
        where: { id: dto.produtoVariacaoPrecoId },
      });

      if (!variacao || variacao.produtoId !== dto.produtoId) {
        throw new BadRequestException('Variação de preço informada não pertence a este produto');
      }
    }

    return this.prisma.promocao.create({ data: dto });
  }

  findAllByProduto(produtoId: string) {
    return this.prisma.promocao.findMany({ where: { produtoId } });
  }

  async findOne(id: string) {
    const promocao = await this.prisma.promocao.findUnique({ where: { id } });

    if (!promocao) {
      throw new NotFoundException(`Promoção com id ${id} não encontrada`);
    }

    return promocao;
  }

  async update(id: string, dto: UpdatePromocaoDto) {
    await this.findOne(id);
    return this.prisma.promocao.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.promocao.delete({ where: { id } });
  }
}