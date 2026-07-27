import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Injectable()
export class MesaService {
  constructor(private readonly prisma: PrismaService) {}

  // Gera um codigo aleatorio e imprevisivel para o QR Code.
  // 32 bytes = 64 caracteres hexadecimais -- impraticavel de adivinhar.
  private gerarQrCode(): string {
    return randomBytes(32).toString('hex');
  }

  // Cria uma mesa, validando que o Ambiente informado existe e pertence
  // (via Ambiente -> Filial) a empresa do usuario logado.
  async create(dto: CreateMesaDto, empresaId: string) {
    const ambiente = await this.prisma.ambiente.findFirst({
      where: { id: dto.ambienteId, filial: { empresaId } },
    });

    if (!ambiente) {
      throw new BadRequestException('Ambiente informado não existe');
    }

    return this.prisma.mesa.create({
      data: {
        ...dto,
        qrCode: this.gerarQrCode(), // qrCode nunca vem do cliente, sempre gerado aqui
      },
    });
  }

  // Lista mesas da empresa do token, via join duplo: Mesa -> Ambiente -> Filial
  findAll(empresaId: string) {
    return this.prisma.mesa.findMany({
      where: { ambiente: { filial: { empresaId } } },
    });
  }

  async findOne(id: string, empresaId: string) {
    const mesa = await this.prisma.mesa.findFirst({
      where: { id, ambiente: { filial: { empresaId } } },
    });

    if (!mesa) {
      throw new NotFoundException(`Mesa com id ${id} não encontrada`);
    }

    return mesa;
  }

  async update(id: string, empresaId: string, dto: UpdateMesaDto) {
    await this.findOne(id, empresaId);
    return this.prisma.mesa.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.mesa.delete({ where: { id } });
  }

  // Busca a cadeia completa (Mesa -> Ambiente -> Filial -> Empresa) a partir
// do qrCode escaneado. Rota PUBLICA -- usada pelo cliente do restaurante,
// sem autenticacao, entao NAO recebe nem valida empresaId.
async buscarPorQrCode(qrCode: string) {
  const mesa = await this.prisma.mesa.findUnique({
    where: { qrCode },
    include: {
      ambiente: {
        include: {
          filial: {
            include: {
              empresa: true,
            },
          },
        },
      },
    },
  });

  if (!mesa || !mesa.ativo) {
    throw new NotFoundException('QR Code inválido ou mesa inativa');
  }

  return {
    mesa: { id: mesa.id, numero: mesa.numero },
    ambiente: { id: mesa.ambiente.id, nome: mesa.ambiente.nome },
    filial: { id: mesa.ambiente.filial.id, nome: mesa.ambiente.filial.nome },
    empresa: {
      id: mesa.ambiente.filial.empresa.id,
      nomeFantasia: mesa.ambiente.filial.empresa.nomeFantasia,
    },
  };
}
}