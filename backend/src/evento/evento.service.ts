import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventoDto, empresaId: string) {
    if (!dto.filialId && !dto.ambienteId) {
      throw new BadRequestException(
        'Informe ao menos uma filial ou ambiente -- necessário para isolar o evento por empresa',
      );
    }

    if (dto.filialId) {
      const filial = await this.prisma.filial.findFirst({ where: { id: dto.filialId, empresaId } });
      if (!filial) {
        throw new BadRequestException('Filial informada não existe');
      }
    }

    if (dto.ambienteId) {
      const ambiente = await this.prisma.ambiente.findFirst({
        where: { id: dto.ambienteId, filial: { empresaId } },
      });
      if (!ambiente) {
        throw new BadRequestException('Ambiente informado não existe');
      }
    }

    return this.prisma.evento.create({
      data: {
        nome: dto.nome,
        tipo: dto.tipo,
        descricao: dto.descricao,
        dataInicio: new Date(dto.dataInicio),
        dataFim: new Date(dto.dataFim),
        filialId: dto.filialId,
        ambienteId: dto.ambienteId,
        valorEntrada: dto.valorEntrada,
        ativo: dto.ativo,
      },
    });
  }

  // Lista eventos da empresa do token -- via filial direta ou via ambiente->filial
  findAll(empresaId: string) {
    return this.prisma.evento.findMany({
      where: { OR: [{ filial: { empresaId } }, { ambiente: { filial: { empresaId } } }] },
      orderBy: { dataInicio: 'asc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const evento = await this.prisma.evento.findFirst({
      where: { id, OR: [{ filial: { empresaId } }, { ambiente: { filial: { empresaId } } }] },
    });

    if (!evento) {
      throw new NotFoundException(`Evento com id ${id} não encontrado`);
    }

    return evento;
  }

  async update(id: string, empresaId: string, dto: UpdateEventoDto) {
    await this.findOne(id, empresaId);

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.dataInicio ? { dataInicio: new Date(dto.dataInicio) } : {}),
        ...(dto.dataFim ? { dataFim: new Date(dto.dataFim) } : {}),
      },
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.evento.delete({ where: { id } });
  }
}
