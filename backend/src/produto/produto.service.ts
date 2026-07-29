import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um produto, validando que Filial e Categoria existem e pertencem
  // a empresa do token (mesmo padrao ja usado em Ambiente/Mesa).
  // Tambem zera teorAlcoolico/ibu se ehAlcoolico vier explicitamente false.
  async create(dto: CreateProdutoDto, empresaId: string) {
    const filial = await this.prisma.filial.findUnique({
      where: { id: dto.filialId },
    });

    if (!filial || filial.empresaId !== empresaId) {
      throw new BadRequestException('Filial informada não existe');
    }

    const categoria = await this.prisma.categoria.findUnique({
      where: { id: dto.categoriaId },
    });

    if (!categoria || categoria.empresaId !== empresaId) {
      throw new BadRequestException('Categoria informada não existe');
    }

    // Se ehAlcoolico vier explicitamente false, zera os campos especificos
    // de bebida, mesmo que tenham sido enviados por engano.
    const dadosProduto = { ...dto };
    if (dadosProduto.ehAlcoolico === false) {
      dadosProduto.teorAlcoolico = undefined;
      dadosProduto.ibu = undefined;
    }

    return this.prisma.produto.create({ data: dadosProduto });
  }

  // Lista produtos ativos (nao deletados) da filial informada.
  // deletedAt: null filtra o soft delete -- produtos "removidos" nao aparecem.
    findAll(filialId: string) {
    return this.prisma.produto.findMany({
        where: { filialId, deletedAt: null },
        include: { produtoVariacaoPrecos: true, produtoMidias: true },
    });
    }

  // Busca um produto especifico, validando que pertence a filial informada
  // e que nao foi removido (soft delete).
  async findOne(id: string, filialId: string) {
    const produto = await this.prisma.produto.findFirst({
      where: { id, filialId, deletedAt: null },
      include: { produtoVariacaoPrecos: true, produtoMidias: true },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    return produto;
  }

  async update(id: string, filialId: string, dto: UpdateProdutoDto) {
    await this.findOne(id, filialId);

    const dadosProduto = { ...dto };
    if (dadosProduto.ehAlcoolico === false) {
        dadosProduto.teorAlcoolico = null as any;
        dadosProduto.ibu = null as any;
    }

    return this.prisma.produto.update({ where: { id }, data: dadosProduto });
  }

  // Soft delete: em vez de apagar a linha, preenche deletedAt com a data atual.
  // O produto some das listagens, mas continua existindo no banco (preserva
  // historico de pedidos que ja referenciaram este produto).
  async remove(id: string, filialId: string) {
    await this.findOne(id, filialId);
    return this.prisma.produto.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}