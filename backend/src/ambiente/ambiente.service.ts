import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';

@Injectable()
export class AmbienteService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um ambiente, validando antes que filial e tipoAmbiente realmente existem
  // (evita erro 500 cru do banco quando a FK nao existe)
  async create(dto: CreateAmbienteDto, empresaId: any) {
    const filial = await this.prisma.filial.findUnique({
      where: { id: dto.filialId },
    });

    if (!filial) {
      throw new BadRequestException('Filial informada não existe');
    }

    const tipoAmbiente = await this.prisma.tipoAmbiente.findUnique({
      where: { id: dto.tipoAmbienteId },
    });

    if (!tipoAmbiente) {
      throw new BadRequestException('Tipo de ambiente informado não existe');
    }

    return this.prisma.ambiente.create({ data: dto });
  }

  // Lista ambientes filtrando pela empresa do token, via join com Filial.
  // "filial: { empresaId }" filtra ambientes cuja Filial relacionada pertence
  // aquela empresa -- sem precisar duplicar empresaId dentro de Ambiente.
  findAll(empresaId: string) {
    return this.prisma.ambiente.findMany({
      where: { filial: { empresaId } },
    });
  }

  // Busca um ambiente especifico, validando que ele pertence (via Filial)
  // a empresa do token. Se nao encontrar (nao existe OU e de outra empresa),
  // lanca o mesmo NotFoundException -- nao revela qual dos dois casos ocorreu.
  async findOne(id: string, empresaId: string) {
    const ambiente = await this.prisma.ambiente.findFirst({
      where: { id, filial: { empresaId } },
    });

    if (!ambiente) {
      throw new NotFoundException(`Ambiente com id ${id} não encontrado`);
    }

    return ambiente;
  }

  async update(id: string, empresaId: string, dto: UpdateAmbienteDto) {
    await this.findOne(id, empresaId); // valida existencia e propriedade antes de atualizar
    return this.prisma.ambiente.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.ambiente.delete({ where: { id } });
  }
}