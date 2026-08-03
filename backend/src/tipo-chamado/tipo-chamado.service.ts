import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoChamadoDto } from './dto/create-tipo-chamado.dto';
import { UpdateTipoChamadoDto } from './dto/update-tipo-chamado.dto';

@Injectable()
export class TipoChamadoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTipoChamadoDto) {
    return this.prisma.tipoChamado.create({ data: dto });
  }

  // Lista os tipos de chamado da empresa do token
  findAll(empresaId: string) {
    return this.prisma.tipoChamado.findMany({ where: { empresaId } });
  }

  // Busca um tipo especifico, validando que pertence a empresa do token
  async findOne(id: string, empresaId: string) {
    const tipoChamado = await this.prisma.tipoChamado.findUnique({ where: { id } });

    if (!tipoChamado || tipoChamado.empresaId !== empresaId) {
      throw new NotFoundException(`Tipo de chamado com id ${id} não encontrado`);
    }

    return tipoChamado;
  }

  async update(id: string, empresaId: string, dto: UpdateTipoChamadoDto) {
    await this.findOne(id, empresaId);
    return this.prisma.tipoChamado.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.tipoChamado.delete({ where: { id } });
  }
}
