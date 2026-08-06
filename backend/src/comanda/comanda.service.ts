import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusComanda } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PresencaService } from '../presenca/presenca.service';
import { CreateComandaDto } from './dto/create-comanda.dto';

const includeItens = {
  itens: true,
  mesa: true,
} as const;

type ComandaComItens = {
  itens: { quantidade: number; precoUnitario: number; status: string }[];
};

@Injectable()
export class ComandaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly presencaService: PresencaService,
  ) {}

  async abrir(dto: CreateComandaDto, empresaId: string, usuarioId: string) {
    const mesa = await this.prisma.mesa.findFirst({
      where: { id: dto.mesaId, ambiente: { filial: { empresaId } } },
    });

    if (!mesa || !mesa.ativo) {
      throw new BadRequestException('Mesa informada não existe ou está inativa');
    }

    const comanda = await this.prisma.comanda.create({
      data: {
        mesaId: dto.mesaId,
        abertaPorUsuarioId: usuarioId,
        ...(dto.nome ? { nome: dto.nome } : {}),
      },
      include: includeItens,
    });

    return this.comTotal(comanda);
  }

  // Uma mesa pode ter varias comandas abertas ao mesmo tempo -- lista todas,
  // mais recente primeiro.
  async findAllByMesa(mesaId: string, empresaId: string) {
    const mesa = await this.prisma.mesa.findFirst({
      where: { id: mesaId, ambiente: { filial: { empresaId } } },
    });

    if (!mesa) {
      throw new BadRequestException('Mesa informada não existe');
    }

    const comandas = await this.prisma.comanda.findMany({
      where: { mesaId },
      include: includeItens,
      orderBy: { abertaEm: 'desc' },
    });

    return comandas.map((comanda) => this.comTotal(comanda));
  }

  async findOne(id: string, empresaId: string) {
    const comanda = await this.prisma.comanda.findFirst({
      where: { id, mesa: { ambiente: { filial: { empresaId } } } },
      include: includeItens,
    });

    if (!comanda) {
      throw new NotFoundException(`Comanda com id ${id} não encontrada`);
    }

    return this.comTotal(comanda);
  }

  async fechar(id: string, empresaId: string) {
    const comanda = await this.buscarAberta(id, empresaId, 'fechar');

    const atualizada = await this.prisma.comanda.update({
      where: { id },
      data: { status: StatusComanda.FECHADA, fechadaEm: new Date() },
      include: includeItens,
    });

    // Fechar a comanda encerra tambem qualquer SessaoPresenca ativa na mesma
    // mesa (Fase 5) -- a mesa "esvaziou" quando a conta fecha.
    await this.presencaService.encerrarPorFechamentoDeComanda(comanda.mesaId);

    return this.comTotal(atualizada);
  }

  async cancelar(id: string, empresaId: string) {
    await this.buscarAberta(id, empresaId, 'cancelar');

    const atualizada = await this.prisma.comanda.update({
      where: { id },
      data: { status: StatusComanda.CANCELADA },
      include: includeItens,
    });

    return this.comTotal(atualizada);
  }

  private async buscarAberta(id: string, empresaId: string, acao: string) {
    const comanda = await this.prisma.comanda.findFirst({
      where: { id, mesa: { ambiente: { filial: { empresaId } } } },
    });

    if (!comanda) {
      throw new NotFoundException(`Comanda com id ${id} não encontrada`);
    }

    if (comanda.status !== StatusComanda.ABERTA) {
      throw new BadRequestException(`Só é possível ${acao} uma comanda aberta`);
    }

    return comanda;
  }

  // Total = soma (quantidade x precoUnitario) dos itens NAO cancelados.
  // Nunca persistido -- sempre recalculado na leitura, pra nao dessincronizar
  // se um item for cancelado depois da soma ter sido feita.
  private comTotal<T extends ComandaComItens>(comanda: T) {
    const total = comanda.itens
      .filter((item) => item.status !== 'CANCELADO')
      .reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0);

    return { ...comanda, total };
  }
}
