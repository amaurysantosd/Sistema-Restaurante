import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusChamado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AtendimentoGateway } from './atendimento.gateway';

const includeCompleto = {
  tipoChamado: true,
  mesa: { include: { ambiente: { include: { filial: true } } } },
} as const;

@Injectable()
export class ChamadoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AtendimentoGateway,
  ) {}

  // Rota publica (sem cliente autenticado -- o schema nem guarda quem chamou,
  // so a mesa). Valida mesa ativa e que o tipo de chamado pertence a mesma
  // empresa da mesa antes de criar.
  async criar(mesaId: string, tipoChamadoId: string) {
    const mesa = await this.prisma.mesa.findUnique({
      where: { id: mesaId },
      include: { ambiente: { include: { filial: true } } },
    });

    if (!mesa || !mesa.ativo) {
      throw new BadRequestException('Mesa informada não existe ou está inativa');
    }

    const empresaId = mesa.ambiente.filial.empresaId;

    const tipoChamado = await this.prisma.tipoChamado.findFirst({
      where: { id: tipoChamadoId, empresaId, ativo: true },
    });

    if (!tipoChamado) {
      throw new BadRequestException('Tipo de chamado informado não existe ou está inativo');
    }

    const chamado = await this.prisma.chamado.create({
      data: { mesaId, tipoChamadoId },
      include: includeCompleto,
    });

    this.gateway.notificarNovoChamado(mesa.ambiente.filial.id, empresaId, chamado);

    return chamado;
  }

  // Lista chamados de uma filial da empresa do token, mais antigos primeiro
  // (quem esta esperando ha mais tempo aparece no topo do painel do garcom).
  async findAll(filialId: string, empresaId: string, status?: StatusChamado) {
    const filial = await this.prisma.filial.findFirst({ where: { id: filialId, empresaId } });
    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    return this.prisma.chamado.findMany({
      where: {
        mesa: { ambiente: { filialId } },
        ...(status ? { status } : {}),
      },
      include: includeCompleto,
      orderBy: { criadoEm: 'asc' },
    });
  }

  // Busca um chamado validando (via Mesa -> Ambiente -> Filial) que pertence
  // a empresa do token.
  async findOne(id: string, empresaId: string) {
    const chamado = await this.prisma.chamado.findFirst({
      where: { id, mesa: { ambiente: { filial: { empresaId } } } },
      include: includeCompleto,
    });

    if (!chamado) {
      throw new NotFoundException(`Chamado com id ${id} não encontrado`);
    }

    return chamado;
  }

  // Staff sinaliza que ja esta indo atender a mesa. Idempotente quanto a
  // quem atende: se outro colega ja tiver assumido o chamado, mantem o
  // atendidoPorUsuarioId original em vez de trocar.
  async atender(id: string, empresaId: string, usuarioId: string) {
    const chamado = await this.findOne(id, empresaId);

    if (chamado.status === StatusChamado.ATENDIDO) {
      throw new BadRequestException('Este chamado já foi atendido');
    }

    const atualizado = await this.prisma.chamado.update({
      where: { id },
      data: {
        status: StatusChamado.EM_ATENDIMENTO,
        atendidoPorUsuarioId: chamado.atendidoPorUsuarioId ?? usuarioId,
      },
      include: includeCompleto,
    });

    this.notificarAtualizacao(atualizado);
    return atualizado;
  }

  // Encerra o chamado. Permite concluir direto de PENDENTE (pular o passo
  // "estou indo"), registrando quem atendeu na hora se ainda nao houver.
  async concluir(id: string, empresaId: string, usuarioId: string) {
    const chamado = await this.findOne(id, empresaId);

    if (chamado.status === StatusChamado.ATENDIDO) {
      throw new BadRequestException('Este chamado já foi atendido');
    }

    const atualizado = await this.prisma.chamado.update({
      where: { id },
      data: {
        status: StatusChamado.ATENDIDO,
        atendidoEm: new Date(),
        atendidoPorUsuarioId: chamado.atendidoPorUsuarioId ?? usuarioId,
      },
      include: includeCompleto,
    });

    this.notificarAtualizacao(atualizado);
    return atualizado;
  }

  private notificarAtualizacao(chamado: {
    mesa: { ambiente: { filial: { id: string; empresaId: string } } };
  }) {
    const { id: filialId, empresaId } = chamado.mesa.ambiente.filial;
    this.gateway.notificarChamadoAtualizado(filialId, empresaId, chamado);
  }
}
