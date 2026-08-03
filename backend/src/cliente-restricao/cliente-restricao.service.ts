import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClienteRestricaoService {
  constructor(private readonly prisma: PrismaService) {}

  async vincularRestricao(clienteId: string, restricaoId: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado — faça login novamente');
    }

    const restricao = await this.prisma.restricaoAlimentar.findUnique({
      where: { id: restricaoId },
    });

    if (!restricao) {
      throw new BadRequestException('Restrição alimentar informada não existe');
    }

    const jaVinculada = await this.prisma.clienteRestricao.findUnique({
      where: { clienteId_restricaoId: { clienteId, restricaoId } },
    });

    if (jaVinculada) {
      throw new BadRequestException('Restrição alimentar já está vinculada a este cliente');
    }

    return this.prisma.clienteRestricao.create({
      data: { clienteId, restricaoId },
    });
  }

  findAllByCliente(clienteId: string) {
    return this.prisma.clienteRestricao.findMany({
      where: { clienteId },
      include: { restricao: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async desvincularRestricao(clienteId: string, restricaoId: string) {
    const vinculacao = await this.prisma.clienteRestricao.findUnique({
      where: { clienteId_restricaoId: { clienteId, restricaoId } },
    });

    if (!vinculacao) {
      throw new NotFoundException('Esta restrição não está vinculada a este cliente');
    }

    return this.prisma.clienteRestricao.delete({
      where: { clienteId_restricaoId: { clienteId, restricaoId } },
    });
  }
}
