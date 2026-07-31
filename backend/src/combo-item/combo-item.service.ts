import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComboItemDto } from './dto/create-combo-item.dto';

@Injectable()
export class ComboItemService {
  constructor(private readonly prisma: PrismaService) {}

  // Adiciona um produto a um combo. Se o produto ja estiver no combo,
  // em vez de criar um registro duplicado, SOMA a quantidade no registro
  // existente -- reflete melhor a intencao do usuario (adicionar de novo
  // = "quero mais desse item", nao um erro).
  async adicionar(comboId: string, produtoId: string, dto: CreateComboItemDto) {
    // Valida que o Combo informado existe
    const combo = await this.prisma.combo.findUnique({ where: { id: comboId } });
    if (!combo) {
      throw new BadRequestException('Combo informado não existe');
    }

    // Valida que o Produto existe e nao foi removido (soft delete)
    const produto = await this.prisma.produto.findFirst({
      where: { id: produtoId, deletedAt: null },
    });
    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    // Se a quantidade nao foi informada no corpo, assume 1 por padrao
    const quantidadeAdicionar = dto.quantidade ?? 1;

    // Verifica se esse par (combo + produto) ja existe, usando a chave
    // composta gerada pelo @@unique([comboId, produtoId]) no schema
    const itemExistente = await this.prisma.comboItem.findUnique({
      where: { comboId_produtoId: { comboId, produtoId } },
    });

    if (itemExistente) {
      // Ja existe: soma a quantidade nova a quantidade que ja estava salva
      return this.prisma.comboItem.update({
        where: { id: itemExistente.id },
        data: { quantidade: itemExistente.quantidade + quantidadeAdicionar },
      });
    }

    // Nao existe ainda: cria o registro pela primeira vez
    return this.prisma.comboItem.create({
      data: { comboId, produtoId, quantidade: quantidadeAdicionar },
    });
  }

  // Lista os itens (produtos) que compoem um combo, trazendo os dados
  // completos do Produto relacionado (nao so o id cru)
  findAllByCombo(comboId: string) {
    return this.prisma.comboItem.findMany({
      where: { comboId },
      include: { produto: true },
    });
  }

  // Remove um item especifico do combo, pelo seu proprio id
  async remover(id: string) {
    const item = await this.prisma.comboItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Item de combo com id ${id} não encontrado`);
    }

    return this.prisma.comboItem.delete({ where: { id } });
  }
}