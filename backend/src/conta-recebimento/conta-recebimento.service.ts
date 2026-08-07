import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Perfil } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContaRecebimentoDto } from './dto/create-conta-recebimento.dto';
import { UpdateContaRecebimentoDto } from './dto/update-conta-recebimento.dto';

// Chave Pix e dado financeiro sensivel -- so ADMIN/GERENTE veem completa.
// Decisao explicita (ver conversa), no mesmo espirito de nunca devolver a
// senha do Usuario.
const PERFIS_QUE_VEEM_CHAVE_COMPLETA: Perfil[] = [Perfil.ADMIN, Perfil.GERENTE];

@Injectable()
export class ContaRecebimentoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContaRecebimentoDto, empresaId: string, perfil: Perfil) {
    const existente = await this.prisma.contaRecebimento.findUnique({
      where: { empresaId_finalidade: { empresaId, finalidade: dto.finalidade } },
    });

    if (existente) {
      throw new BadRequestException(
        `Já existe uma conta de recebimento cadastrada para a finalidade ${dto.finalidade}`,
      );
    }

    const conta = await this.prisma.contaRecebimento.create({ data: { ...dto, empresaId } });
    return this.aplicarMascara(conta, perfil);
  }

  async findAll(empresaId: string, perfil: Perfil) {
    const contas = await this.prisma.contaRecebimento.findMany({ where: { empresaId } });
    return contas.map((conta) => this.aplicarMascara(conta, perfil));
  }

  async findOne(id: string, empresaId: string, perfil: Perfil) {
    const conta = await this.buscarBruta(id, empresaId);
    return this.aplicarMascara(conta, perfil);
  }

  async update(id: string, empresaId: string, perfil: Perfil, dto: UpdateContaRecebimentoDto) {
    await this.buscarBruta(id, empresaId);
    const atualizada = await this.prisma.contaRecebimento.update({ where: { id }, data: dto });
    return this.aplicarMascara(atualizada, perfil);
  }

  async remove(id: string, empresaId: string) {
    await this.buscarBruta(id, empresaId);
    return this.prisma.contaRecebimento.delete({ where: { id } });
  }

  private async buscarBruta(id: string, empresaId: string) {
    const conta = await this.prisma.contaRecebimento.findFirst({ where: { id, empresaId } });

    if (!conta) {
      throw new NotFoundException(`Conta de recebimento com id ${id} não encontrada`);
    }

    return conta;
  }

  // GARCOM/CAIXA/COZINHA/BAR veem so os ultimos 4 caracteres da chave, resto
  // mascarado. ADMIN/GERENTE veem completa.
  private aplicarMascara<T extends { chavePix: string }>(conta: T, perfil: Perfil): T {
    if (PERFIS_QUE_VEEM_CHAVE_COMPLETA.includes(perfil)) {
      return conta;
    }

    const chave = conta.chavePix;
    const chavePix =
      chave.length <= 4 ? '*'.repeat(chave.length) : '*'.repeat(chave.length - 4) + chave.slice(-4);

    return { ...conta, chavePix };
  }
}
