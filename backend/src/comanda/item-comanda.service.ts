import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DestinoPreparo, StatusItemComanda } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemComandaDto } from './dto/create-item-comanda.dto';

@Injectable()
export class ItemComandaService {
  constructor(private readonly prisma: PrismaService) {}

  async adicionar(
    comandaId: string,
    empresaId: string,
    usuarioId: string,
    dto: CreateItemComandaDto,
  ) {
    const temProduto = !!dto.produtoVariacaoPrecoId;
    const temCombo = !!dto.comboId;

    // XOR: os dois preenchidos ou os dois vazios sao igualmente invalidos
    if (temProduto === temCombo) {
      throw new BadRequestException(
        'Informe exatamente um entre produtoVariacaoPrecoId e comboId',
      );
    }

    const comanda = await this.prisma.comanda.findFirst({
      where: { id: comandaId, mesa: { ambiente: { filial: { empresaId } } } },
      include: { mesa: { include: { ambiente: true } } },
    });

    if (!comanda) {
      throw new NotFoundException(`Comanda com id ${comandaId} não encontrada`);
    }

    if (comanda.status !== 'ABERTA') {
      throw new BadRequestException(
        'Não é possível adicionar itens a uma comanda que não está aberta',
      );
    }

    const filialId = comanda.mesa.ambiente.filialId;
    const quantidade = dto.quantidade ?? 1;

    // precoUnitario e destino sao CONGELADOS aqui -- nunca mudam depois,
    // mesmo que o preco/categoria do produto mude no futuro (preserva o
    // historico de venda real daquele momento).
    let precoUnitario: number;
    let destino: DestinoPreparo;

    if (temProduto) {
      const variacao = await this.prisma.produtoVariacaoPreco.findFirst({
        where: { id: dto.produtoVariacaoPrecoId, produto: { filialId, deletedAt: null } },
        include: { produto: { include: { categoria: true } } },
      });

      if (!variacao) {
        throw new BadRequestException('Variação de preço informada não existe');
      }

      precoUnitario = variacao.preco;
      destino = variacao.produto.destino ?? variacao.produto.categoria.destinoPadrao;
    } else {
      const combo = await this.prisma.combo.findFirst({
        where: { id: dto.comboId, filialId },
      });

      if (!combo) {
        throw new BadRequestException('Combo informado não existe');
      }

      precoUnitario = combo.preco;
      // Combo nao tem campo destino nem categoria propria no schema (pode
      // misturar itens de cozinha e bar) -- default COZINHA acordado.
      destino = DestinoPreparo.COZINHA;
    }

    return this.prisma.itemComanda.create({
      data: {
        comandaId,
        quantidade,
        precoUnitario,
        destino,
        criadoPorUsuarioId: usuarioId,
        ...(temProduto
          ? { produtoVariacaoPrecoId: dto.produtoVariacaoPrecoId }
          : { comboId: dto.comboId }),
      },
    });
  }

  async atualizarStatus(id: string, empresaId: string, status: StatusItemComanda) {
    const item = await this.prisma.itemComanda.findFirst({
      where: { id, comanda: { mesa: { ambiente: { filial: { empresaId } } } } },
    });

    if (!item) {
      throw new NotFoundException(`Item de comanda com id ${id} não encontrado`);
    }

    // ENTREGUE e CANCELADO sao estados finais -- nao aceitam nova transicao
    if (item.status === 'ENTREGUE' || item.status === 'CANCELADO') {
      throw new BadRequestException('Este item não pode mais mudar de status');
    }

    return this.prisma.itemComanda.update({
      where: { id },
      data: {
        status,
        ...(status === StatusItemComanda.PRONTO ? { prontoEm: new Date() } : {}),
        ...(status === StatusItemComanda.ENTREGUE ? { entregueEm: new Date() } : {}),
      },
    });
  }
}
