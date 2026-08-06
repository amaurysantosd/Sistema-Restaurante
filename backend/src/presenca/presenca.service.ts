import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma, SessaoPresenca, StatusSessao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AtendimentoGateway } from '../atendimento/atendimento.gateway';
import { HistoricoVisitaService } from '../historico-visita/historico-visita.service';
import {
  JANELA_REAPROVEITAMENTO_SESSAO_HORAS,
  LIMITE_INATIVIDADE_HORAS,
  MINIMO_VISITAS_RECORRENTE,
  MINIMO_VISITAS_VIP_AUTOMATICO,
  MINIMO_PONTOS_VIP_AUTOMATICO,
} from './presenca.constants';

function horasAtras(horas: number): Date {
  return new Date(Date.now() - horas * 60 * 60 * 1000);
}

type MesaComFilial = Prisma.MesaGetPayload<{
  include: { ambiente: { include: { filial: true } } };
}>;

@Injectable()
export class PresencaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AtendimentoGateway,
    private readonly historicoVisitaService: HistoricoVisitaService,
  ) {}

  // Disparado pelo check-in automatico no QR Code (so quando o cliente esta
  // logado). Reaproveita sessao ATIVA do mesmo cliente+mesa se a ultima
  // atividade foi dentro da janela; senao, cria uma nova e avalia se o
  // cliente e notavel (recorrente/VIP) pra notificar o staff.
  async checkIn(clienteId: string, mesaId: string) {
    const existente = await this.prisma.sessaoPresenca.findFirst({
      where: {
        clienteId,
        mesaId,
        status: StatusSessao.ATIVA,
        ultimaAtividadeEm: { gte: horasAtras(JANELA_REAPROVEITAMENTO_SESSAO_HORAS) },
      },
    });

    if (existente) {
      return this.prisma.sessaoPresenca.update({
        where: { id: existente.id },
        data: { ultimaAtividadeEm: new Date() },
      });
    }

    const mesa = await this.prisma.mesa.findUniqueOrThrow({
      where: { id: mesaId },
      include: { ambiente: { include: { filial: true } } },
    });

    // Sessao NOVA (nao reaproveitamento) conta como visita de verdade --
    // registra ANTES do calculo de recorrente/VIP, ja que esse calculo
    // depende do HistoricoVisita/ClienteFilial que este passo garante.
    await this.historicoVisitaService.registrarVisita(
      clienteId,
      mesa.ambiente.filialId,
      mesaId,
    );

    const sessao = await this.prisma.sessaoPresenca.create({
      data: { clienteId, mesaId },
    });

    await this.avaliarNotavel(clienteId, mesa, sessao);

    return sessao;
  }

  // Atualiza a ultima atividade de uma sessao ATIVA ja existente (ex: ao
  // marcar ConsumoCliente) -- nunca cria sessao nova aqui; se nao houver
  // sessao ativa pra aquele cliente+mesa, e um no-op silencioso (o cliente
  // pode estar consumindo sem ter escaneado o QR logado, por exemplo).
  async registrarAtividade(clienteId: string, mesaId: string) {
    await this.prisma.sessaoPresenca.updateMany({
      where: { clienteId, mesaId, status: StatusSessao.ATIVA },
      data: { ultimaAtividadeEm: new Date() },
    });
  }

  // Chamado por ComandaService.fechar -- encerra qualquer sessao ATIVA
  // daquela mesa (mesmo se for de outro cliente que nao o desta comanda,
  // ja que a mesa inteira "esvaziou" quando a conta fecha).
  async encerrarPorFechamentoDeComanda(mesaId: string) {
    await this.prisma.sessaoPresenca.updateMany({
      where: { mesaId, status: StatusSessao.ATIVA },
      data: { status: StatusSessao.ENCERRADA, encerradaEm: new Date() },
    });
  }

  // Job agendado: encerra sessoes cuja ultima atividade passou do limite de
  // inatividade. Roda a cada 15 minutos -- folga suficiente em relacao ao
  // limite de 3h sem deixar sessoes "zumbis" por muito tempo.
  @Cron('*/15 * * * *')
  async encerrarPorInatividade() {
    await this.prisma.sessaoPresenca.updateMany({
      where: {
        status: StatusSessao.ATIVA,
        ultimaAtividadeEm: { lt: horasAtras(LIMITE_INATIVIDADE_HORAS) },
      },
      data: { status: StatusSessao.ENCERRADA, encerradaEm: new Date() },
    });
  }

  // Staff: quem esta presente agora numa filial, em qual mesa, desde quando.
  async findAllAtivasPorFilial(filialId: string, empresaId: string) {
    const filial = await this.prisma.filial.findFirst({ where: { id: filialId, empresaId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    return this.prisma.sessaoPresenca.findMany({
      where: { status: StatusSessao.ATIVA, mesa: { ambiente: { filialId } } },
      include: { cliente: true, mesa: true },
      orderBy: { checkInEm: 'asc' },
    });
  }

  // So roda na CRIACAO de uma sessao nova (nao em reaproveitamento) -- avisa
  // o staff em tempo real quando quem chegou e recorrente ou VIP, pra um
  // atendimento diferenciado.
  private async avaliarNotavel(clienteId: string, mesa: MesaComFilial, sessao: SessaoPresenca) {
    const filialId = mesa.ambiente.filialId;
    const empresaId = mesa.ambiente.filial.empresaId;

    const totalVisitas = await this.prisma.historicoVisita.count({
      where: { clienteId, filialId },
    });

    const clienteFilial = await this.prisma.clienteFilial.findUnique({
      where: { clienteId_filialId: { clienteId, filialId } },
    });

    const vipManual = clienteFilial?.vipManual ?? false;
    const vipAutomatico =
      totalVisitas >= MINIMO_VISITAS_VIP_AUTOMATICO ||
      (clienteFilial?.pontosFidelidade ?? 0) >= MINIMO_PONTOS_VIP_AUTOMATICO;
    const recorrente = totalVisitas >= MINIMO_VISITAS_RECORRENTE;

    if (!vipManual && !vipAutomatico && !recorrente) {
      return;
    }

    const motivo = vipManual ? 'VIP_MANUAL' : vipAutomatico ? 'VIP_AUTOMATICO' : 'RECORRENTE';

    const cliente = await this.prisma.cliente.findUniqueOrThrow({ where: { id: clienteId } });

    this.gateway.notificarClienteNotavel(filialId, empresaId, {
      sessaoId: sessao.id,
      motivo,
      cliente: { id: cliente.id, nome: cliente.nome },
      mesa: { id: mesa.id, numero: mesa.numero },
    });
  }
}
