import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AjustarClienteFilialDto } from './dto/ajustar-cliente-filial.dto';

@Injectable()
export class ClienteFilialService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByCliente(clienteId: string) {
    return this.prisma.clienteFilial.findMany({
      where: { clienteId },
      include: { filial: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Credita/debita pontos e/ou cashback de um cliente numa filial da empresa
  // do staff logado. Le o saldo atual (0 se o vinculo ainda nao existir) e
  // grava o resultado ja somado -- nunca deixa o saldo ficar negativo.
  async ajustar(
    empresaId: string,
    filialId: string,
    clienteId: string,
    dto: AjustarClienteFilialDto,
  ) {
    if (dto.pontos === undefined && dto.cashback === undefined) {
      throw new BadRequestException('Informe pontos e/ou cashback para ajustar');
    }

    const filial = await this.prisma.filial.findFirst({
      where: { id: filialId, empresaId },
    });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado');
    }

    const atual = await this.prisma.clienteFilial.findUnique({
      where: { clienteId_filialId: { clienteId, filialId } },
    });

    const novoPontos = (atual?.pontosFidelidade ?? 0) + (dto.pontos ?? 0);
    const novoSaldo = (atual?.saldoCashback ?? 0) + (dto.cashback ?? 0);

    if (novoPontos < 0 || novoSaldo < 0) {
      throw new BadRequestException('Ajuste resultaria em saldo negativo');
    }

    return this.prisma.clienteFilial.upsert({
      where: { clienteId_filialId: { clienteId, filialId } },
      update: { pontosFidelidade: novoPontos, saldoCashback: novoSaldo },
      create: {
        clienteId,
        filialId,
        pontosFidelidade: novoPontos,
        saldoCashback: novoSaldo,
      },
    });
  }
}
