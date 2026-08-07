import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusListaEspera } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AtendimentoGateway } from '../atendimento/atendimento.gateway';
import { CreateListaEsperaDto } from './dto/create-lista-espera.dto';

@Injectable()
export class ListaEsperaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AtendimentoGateway,
  ) {}

  // Staff adiciona um grupo que chegou sem reserva na fila -- diferente de
  // Chamado (Fase 4), nao ha mesa/QR Code envolvido aqui (o grupo ainda nao
  // tem mesa), entao a criacao e sempre feita pelo staff no balcao.
  async criar(dto: CreateListaEsperaDto, empresaId: string) {
    const filial = await this.prisma.filial.findFirst({ where: { id: dto.filialId, empresaId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    if (dto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({ where: { id: dto.clienteId } });
      if (!cliente) {
        throw new BadRequestException('Cliente informado não existe');
      }
    }

    const item = await this.prisma.listaEspera.create({ data: dto });

    this.gateway.notificarListaEsperaNovo(dto.filialId, empresaId, item);

    return item;
  }

  async findAllByFilial(filialId: string, empresaId: string, status?: StatusListaEspera) {
    const filial = await this.prisma.filial.findFirst({ where: { id: filialId, empresaId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    return this.prisma.listaEspera.findMany({
      where: { filialId, ...(status ? { status } : {}) },
      include: { cliente: true },
      orderBy: { criadoEm: 'asc' },
    });
  }

  async chamar(id: string, empresaId: string) {
    const item = await this.buscarBruta(id, empresaId);

    if (item.status !== StatusListaEspera.AGUARDANDO) {
      throw new BadRequestException('Só é possível chamar quem ainda está aguardando');
    }

    const atualizado = await this.prisma.listaEspera.update({
      where: { id },
      data: { status: StatusListaEspera.CHAMADO, chamadoEm: new Date() },
    });

    this.gateway.notificarListaEsperaAtualizado(item.filialId, empresaId, atualizado);
    return atualizado;
  }

  async atender(id: string, empresaId: string) {
    const item = await this.buscarBruta(id, empresaId);

    if (item.status === StatusListaEspera.ATENDIDO || item.status === StatusListaEspera.DESISTIU) {
      throw new BadRequestException('Este grupo já saiu da fila de espera');
    }

    const atualizado = await this.prisma.listaEspera.update({
      where: { id },
      data: { status: StatusListaEspera.ATENDIDO, atendidoEm: new Date() },
    });

    this.gateway.notificarListaEsperaAtualizado(item.filialId, empresaId, atualizado);
    return atualizado;
  }

  async desistir(id: string, empresaId: string) {
    const item = await this.buscarBruta(id, empresaId);

    if (item.status === StatusListaEspera.ATENDIDO || item.status === StatusListaEspera.DESISTIU) {
      throw new BadRequestException('Este grupo já saiu da fila de espera');
    }

    const atualizado = await this.prisma.listaEspera.update({
      where: { id },
      data: { status: StatusListaEspera.DESISTIU },
    });

    this.gateway.notificarListaEsperaAtualizado(item.filialId, empresaId, atualizado);
    return atualizado;
  }

  private async buscarBruta(id: string, empresaId: string) {
    const item = await this.prisma.listaEspera.findFirst({ where: { id, filial: { empresaId } } });

    if (!item) {
      throw new NotFoundException(`Item de lista de espera com id ${id} não encontrado`);
    }

    return item;
  }
}
