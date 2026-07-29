import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';

@Injectable()
export class IngredienteService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateIngredienteDto) {
    return this.prisma.ingrediente.create({ data: dto });
  }

  // Lista os ingredientes da empresa do token
  findAll(empresaId: string) {
    return this.prisma.ingrediente.findMany({ where: { empresaId } });
  }

  // Busca um ingrediente especifico, validando que pertence a empresa do token
  async findOne(id: string, empresaId: string) {
    const ingrediente = await this.prisma.ingrediente.findUnique({ where: { id } });

    if (!ingrediente || ingrediente.empresaId !== empresaId) {
      throw new NotFoundException(`Ingrediente com id ${id} não encontrado`);
    }

    return ingrediente;
  }

  async update(id: string, empresaId: string, dto: UpdateIngredienteDto) {
    await this.findOne(id, empresaId);
    return this.prisma.ingrediente.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.ingrediente.delete({ where: { id } });
  }
}