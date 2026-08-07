import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ModalidadePagamentoReserva, StatusReserva, TipoEvento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CreateReservaStaffDto } from './dto/create-reserva-staff.dto';
import {
  DURACAO_OCUPACAO_MESA_MINUTOS,
  TOLERANCIA_COMPARECIMENTO_MINUTOS,
} from './reserva.constants';

function minutosDepois(data: Date, minutos: number): Date {
  return new Date(data.getTime() + minutos * 60 * 1000);
}

function minutosAntes(data: Date, minutos: number): Date {
  return new Date(data.getTime() - minutos * 60 * 1000);
}

@Injectable()
export class ReservaService {
  constructor(private readonly prisma: PrismaService) {}

  // Reserva feita pelo proprio Cliente (ClienteAuthGuard) -- sempre pra si
  // mesmo, nunca criada "por" um staff (criadoPorUsuarioId fica null).
  criarComoCliente(dto: CreateReservaDto, clienteId: string) {
    return this.criar(dto, { clienteId });
  }

  // Reserva feita pelo staff (JwtAuthGuard) -- pode vincular a um Cliente
  // cadastrado (dto.clienteId) ou capturar nomeConvidado/telefoneConvidado
  // direto (reserva por telefone, sem cadastro).
  criarComoStaff(dto: CreateReservaStaffDto, usuarioId: string) {
    return this.criar(dto, { clienteId: dto.clienteId, usuarioId });
  }

  private async criar(
    dto: CreateReservaDto,
    contexto: { clienteId?: string; usuarioId?: string },
  ) {
    const filial = await this.prisma.filial.findUnique({ where: { id: dto.filialId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    if (dto.ambienteId) {
      const ambiente = await this.prisma.ambiente.findFirst({
        where: { id: dto.ambienteId, filialId: dto.filialId },
      });
      if (!ambiente) {
        throw new BadRequestException('Ambiente informado não pertence a esta filial');
      }
    }

    if (dto.mesaId) {
      const mesa = await this.prisma.mesa.findFirst({
        where: { id: dto.mesaId, ambiente: { filialId: dto.filialId } },
      });
      if (!mesa) {
        throw new BadRequestException('Mesa informada não pertence a esta filial');
      }
    }

    if (dto.eventoId) {
      const evento = await this.prisma.evento.findFirst({ where: { id: dto.eventoId, ativo: true } });
      if (!evento) {
        throw new BadRequestException('Evento informado não existe ou está inativo');
      }
    }

    if (contexto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({ where: { id: contexto.clienteId } });
      if (!cliente) {
        throw new BadRequestException('Cliente não encontrado — faça login novamente');
      }
    }

    const dataHora = new Date(dto.dataHora);
    const fimOcupacao = minutosDepois(dataHora, DURACAO_OCUPACAO_MESA_MINUTOS);
    const inicioJanelaConflito = minutosAntes(dataHora, DURACAO_OCUPACAO_MESA_MINUTOS);
    const statusQueOcupam = [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA];

    // 6.1 -- conflito de horario na mesma mesa/ambiente. Como o schema so tem
    // dataHora (sem duracao explicita), duas reservas "colidem" se a diferenca
    // entre os horarios for menor que DURACAO_OCUPACAO_MESA_MINUTOS.
    if (dto.mesaId) {
      const conflito = await this.prisma.reserva.findFirst({
        where: {
          mesaId: dto.mesaId,
          status: { in: statusQueOcupam },
          dataHora: { gt: inicioJanelaConflito, lt: fimOcupacao },
        },
      });
      if (conflito) {
        throw new BadRequestException('Já existe uma reserva para esta mesa nesse horário');
      }
    } else if (dto.ambienteId) {
      const conflito = await this.prisma.reserva.findFirst({
        where: {
          ambienteId: dto.ambienteId,
          status: { in: statusQueOcupam },
          dataHora: { gt: inicioJanelaConflito, lt: fimOcupacao },
        },
      });
      if (conflito) {
        throw new BadRequestException('Já existe uma reserva para este ambiente nesse horário');
      }
    }

    // 6.1 -- Evento PARTICULAR bloqueia a filial/ambiente inteiro no periodo
    const eventoBloqueando = await this.prisma.evento.findFirst({
      where: {
        ativo: true,
        tipo: TipoEvento.PARTICULAR,
        dataInicio: { lt: fimOcupacao },
        dataFim: { gt: dataHora },
        OR: [{ filialId: dto.filialId }, ...(dto.ambienteId ? [{ ambienteId: dto.ambienteId }] : [])],
      },
    });
    if (eventoBloqueando) {
      throw new BadRequestException(
        `Não é possível reservar: o evento "${eventoBloqueando.nome}" bloqueia este horário`,
      );
    }

    // 6.2 -- calculo do sinal, congelando o percentual usado no momento da
    // criacao (mudanca na config depois nao afeta reservas ja criadas)
    let percentualSinal: number | null = null;
    let valorSinal: number | null = null;
    if (dto.valorOrcamento) {
      percentualSinal = dto.percentualSinal ?? filial.reservaPercentualSinalPadrao;
      valorSinal = dto.valorOrcamento * (percentualSinal / 100);
    }

    const reserva = await this.prisma.reserva.create({
      data: {
        dataHora,
        quantidadePessoas: dto.quantidadePessoas,
        observacoes: dto.observacoes,
        nomeConvidado: contexto.clienteId ? undefined : dto.nomeConvidado,
        telefoneConvidado: contexto.clienteId ? undefined : dto.telefoneConvidado,
        valorOrcamento: dto.valorOrcamento,
        percentualSinal,
        valorSinal,
        toleranciaAte: minutosDepois(dataHora, TOLERANCIA_COMPARECIMENTO_MINUTOS),
        filialId: dto.filialId,
        ambienteId: dto.ambienteId,
        mesaId: dto.mesaId,
        eventoId: dto.eventoId,
        clienteId: contexto.clienteId,
        criadoPorUsuarioId: contexto.usuarioId,
      },
    });

    // 6.3 -- se houver sinal e a modalidade for PIX_MANUAL, anexa os dados de
    // recebimento na resposta pro frontend exibir o "copia e cola". GATEWAY
    // fica de fora por enquanto (Fase 9, nao implementado) -- so nao anexa
    // nada, a reserva e criada normalmente.
    if (valorSinal && valorSinal > 0) {
      const empresa = await this.prisma.empresa.findUniqueOrThrow({
        where: { id: filial.empresaId },
      });

      if (empresa.modalidadePagamentoReserva === ModalidadePagamentoReserva.PIX_MANUAL) {
        const conta = await this.buscarContaRecebimentoReserva(filial.empresaId);
        return { ...reserva, contaRecebimento: conta };
      }
    }

    return reserva;
  }

  // Conta RESERVA tem prioridade; GERAL e o fallback se nao houver uma
  // especifica pra reservas.
  private async buscarContaRecebimentoReserva(empresaId: string) {
    const contaReserva = await this.prisma.contaRecebimento.findFirst({
      where: { empresaId, ativo: true, finalidade: 'RESERVA' },
    });
    if (contaReserva) {
      return contaReserva;
    }

    const contaGeral = await this.prisma.contaRecebimento.findFirst({
      where: { empresaId, ativo: true, finalidade: 'GERAL' },
    });
    if (contaGeral) {
      return contaGeral;
    }

    throw new BadRequestException(
      'Esta empresa ainda não cadastrou uma forma de recebimento para reservas com sinal',
    );
  }

  async findAllByFilial(filialId: string, empresaId: string) {
    const filial = await this.prisma.filial.findFirst({ where: { id: filialId, empresaId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    return this.prisma.reserva.findMany({
      where: { filialId },
      include: { cliente: true, mesa: true, ambiente: true, evento: true },
      orderBy: { dataHora: 'asc' },
    });
  }

  findAllMinhas(clienteId: string) {
    return this.prisma.reserva.findMany({
      where: { clienteId },
      include: { filial: true, mesa: true, ambiente: true, evento: true },
      orderBy: { dataHora: 'desc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const reserva = await this.prisma.reserva.findFirst({
      where: { id, filial: { empresaId } },
      include: { cliente: true, mesa: true, ambiente: true, evento: true },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva com id ${id} não encontrada`);
    }

    return reserva;
  }

  // 6.4 -- confirmacao manual do sinal
  async confirmarSinal(id: string, empresaId: string) {
    const reserva = await this.buscarBruta(id, empresaId);

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new BadRequestException('Só é possível confirmar o sinal de uma reserva pendente');
    }

    return this.prisma.reserva.update({
      where: { id },
      data: { sinalPago: true, status: StatusReserva.CONFIRMADA },
    });
  }

  async cancelar(id: string, empresaId: string) {
    const reserva = await this.buscarBruta(id, empresaId);

    if (reserva.status !== StatusReserva.PENDENTE && reserva.status !== StatusReserva.CONFIRMADA) {
      throw new BadRequestException('Só é possível cancelar uma reserva pendente ou confirmada');
    }

    return this.prisma.reserva.update({
      where: { id },
      data: { status: StatusReserva.CANCELADA },
    });
  }

  private async buscarBruta(id: string, empresaId: string) {
    const reserva = await this.prisma.reserva.findFirst({ where: { id, filial: { empresaId } } });

    if (!reserva) {
      throw new NotFoundException(`Reserva com id ${id} não encontrada`);
    }

    return reserva;
  }

  // 6.5 -- job de no-show. Roda a cada 5 minutos: como no-show trata de um
  // horario agendado no futuro (nao "em tempo real" feito a inatividade de
  // SessaoPresenca), nao precisa da mesma folga de 15min da Fase 5 -- 5min
  // libera a mesa mais rapido pra quem esta na lista de espera ou quer
  // reservar aquele horario, sem sobrecarregar o banco (query simples e
  // indexada por status/dataHora).
  @Cron('*/5 * * * *')
  async marcarNoShow() {
    await this.prisma.reserva.updateMany({
      where: {
        status: { in: [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA] },
        toleranciaAte: { lt: new Date() },
      },
      data: { status: StatusReserva.NAO_COMPARECEU },
    });
  }

  // 6.6 -- chamado pelo PresencaService.checkIn a cada scan de QR Code.
  // Busca uma Reserva CONFIRMADA do cliente que "combine" com o check-in:
  // mesma mesa (prioridade), ou mesmo ambiente/filial se a reserva nao tiver
  // mesa fixa, dentro da janela [dataHora - tolerancia, dataHora + duracao].
  // Se mais de uma bater, marca a mais proxima do horario atual.
  async marcarComparecimentoSeHouver(clienteId: string, mesaId: string) {
    const mesa = await this.prisma.mesa.findUnique({
      where: { id: mesaId },
      include: { ambiente: true },
    });
    if (!mesa) {
      return;
    }

    const agora = new Date();
    const limiteInferior = minutosAntes(agora, DURACAO_OCUPACAO_MESA_MINUTOS);
    const limiteSuperior = minutosDepois(agora, TOLERANCIA_COMPARECIMENTO_MINUTOS);

    const candidatas = await this.prisma.reserva.findMany({
      where: {
        clienteId,
        status: StatusReserva.CONFIRMADA,
        dataHora: { gte: limiteInferior, lte: limiteSuperior },
        OR: [
          { mesaId },
          { mesaId: null, ambienteId: mesa.ambienteId },
          { mesaId: null, ambienteId: null, filialId: mesa.ambiente.filialId },
        ],
      },
    });

    if (candidatas.length === 0) {
      return;
    }

    const maisProxima = candidatas.reduce((maisProx, atual) =>
      Math.abs(atual.dataHora.getTime() - agora.getTime()) <
      Math.abs(maisProx.dataHora.getTime() - agora.getTime())
        ? atual
        : maisProx,
    );

    await this.prisma.reserva.update({
      where: { id: maisProxima.id },
      data: { status: StatusReserva.COMPARECEU },
    });
  }
}
