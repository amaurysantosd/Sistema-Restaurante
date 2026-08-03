import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoricoVisitaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrarVisita(clienteId: string, filialId: string, mesaId?: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado — faça login novamente');
    }

    const filial = await this.prisma.filial.findUnique({ where: { id: filialId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    if (mesaId) {
      const mesa = await this.prisma.mesa.findUnique({ where: { id: mesaId } });
      if (!mesa) {
        throw new BadRequestException('Mesa informada não existe');
      }
    }

    // Garante o vinculo ClienteFilial (pontos/cashback) desde a primeira
    // visita, sem exigir que o cliente "entre" no programa de fidelidade
    // separadamente -- se ja existir, nao mexe nos saldos acumulados.
    await this.prisma.clienteFilial.upsert({
      where: { clienteId_filialId: { clienteId, filialId } },
      update: {},
      create: { clienteId, filialId },
    });

    return this.prisma.historicoVisita.create({
      data: {
        clienteId,
        filialId,
        ...(mesaId ? { mesaId } : {}),
      },
    });
  }

  findAllByCliente(clienteId: string) {
    return this.prisma.historicoVisita.findMany({
      where: { clienteId },
      include: {
        filial: true,
        mesa: true,
      },
      orderBy: { dataVisita: 'desc' },
    });
  }

  async removerVisita(clienteId: string, visitaId: string) {
    const visita = await this.prisma.historicoVisita.findUnique({
      where: { id: visitaId },
    });

    if (!visita) {
      throw new NotFoundException('Registro de visita não encontrado');
    }

    if (visita.clienteId !== clienteId) {
      throw new NotFoundException('Este registro não pertence ao cliente autenticado');
    }

    return this.prisma.historicoVisita.delete({
      where: { id: visitaId },
    });
  }
}
