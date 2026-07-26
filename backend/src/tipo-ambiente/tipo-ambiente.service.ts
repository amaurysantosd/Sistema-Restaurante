import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoAmbienteDto } from './dto/create-tipo-ambiente.dto';
import { UpdateTipoAmbienteDto } from './dto/update-tipo-ambiente.dto';

@Injectable()
export class TipoAmbienteService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTipoAmbienteDto) {
    return this.prisma.tipoAmbiente.create({ data: dto });
  }

  // Lista os tipos de ambiente da empresa do token
  findAll(empresaId: string) {
    return this.prisma.tipoAmbiente.findMany({ where: { empresaId } });
  }

  // Busca um tipo especifico, validando que pertence a empresa do token
  async findOne(id: string, empresaId: string) {
    const tipoAmbiente = await this.prisma.tipoAmbiente.findUnique({ where: { id } });

    if (!tipoAmbiente || tipoAmbiente.empresaId !== empresaId) {
      throw new NotFoundException(`Tipo de ambiente com id ${id} não encontrado`);
    }

    return tipoAmbiente;
  }

  async update(id: string, empresaId: string, dto: UpdateTipoAmbienteDto) {
    await this.findOne(id, empresaId);
    return this.prisma.tipoAmbiente.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.tipoAmbiente.delete({ where: { id } });
  }
}