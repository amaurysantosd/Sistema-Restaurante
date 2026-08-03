import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsumoClienteDto } from './dto/create-consumo-cliente.dto';

@Injectable()
export class ConsumoClienteService {
  constructor(private readonly prisma: PrismaService) {}

  // Sem @@unique no schema -- cada marcacao e um evento proprio (nao soma
  // quantidade numa linha existente), pra preservar o "quando" de cada
  // marcacao (ex: duas rodadas do mesmo chopp em horarios diferentes).
  async marcar(clienteId: string, dto: CreateConsumoClienteDto) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado — faça login novamente');
    }

    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, deletedAt: null },
    });
    if (!produto) {
      throw new BadRequestException('Produto informado não existe');
    }

    const mesa = await this.prisma.mesa.findUnique({ where: { id: dto.mesaId } });
    if (!mesa || !mesa.ativo) {
      throw new BadRequestException('Mesa informada não existe ou está inativa');
    }

    return this.prisma.consumoCliente.create({
      data: {
        clienteId,
        produtoId: dto.produtoId,
        mesaId: dto.mesaId,
        quantidade: dto.quantidade ?? 1,
      },
    });
  }

  findAllByCliente(clienteId: string) {
    return this.prisma.consumoCliente.findMany({
      where: { clienteId },
      include: { produto: true },
      orderBy: { marcadoEm: 'desc' },
    });
  }

  async remover(clienteId: string, id: string) {
    const consumo = await this.prisma.consumoCliente.findUnique({ where: { id } });

    if (!consumo || consumo.clienteId !== clienteId) {
      throw new NotFoundException('Marcação de consumo não encontrada');
    }

    return this.prisma.consumoCliente.delete({ where: { id } });
  }

  // Staff so pode ver as marcacoes de consumo de uma mesa se a Filial tiver
  // habilitado exibirConsumoClienteParaGarcom -- feature informal do
  // cliente, exposicao pro staff e opt-in por filial.
  async findAllByMesaParaStaff(mesaId: string, empresaId: string) {
    const mesa = await this.prisma.mesa.findFirst({
      where: { id: mesaId, ambiente: { filial: { empresaId } } },
      include: { ambiente: { include: { filial: true } } },
    });

    if (!mesa) {
      throw new NotFoundException(`Mesa com id ${mesaId} não encontrada`);
    }

    if (!mesa.ambiente.filial.exibirConsumoClienteParaGarcom) {
      throw new ForbiddenException(
        'Esta filial não habilitou a visualização de consumo do cliente para o staff',
      );
    }

    return this.prisma.consumoCliente.findMany({
      where: { mesaId },
      include: { produto: true, cliente: true },
      orderBy: { marcadoEm: 'desc' },
    });
  }
}
