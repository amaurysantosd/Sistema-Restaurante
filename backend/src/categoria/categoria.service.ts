import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  findAll(empresaId: string) {
    return this.prisma.categoria.findMany({ where: { empresaId } });
  }

  async findOne(id: string, empresaId: string) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }
    if (categoria.empresaId !== empresaId) {
      throw new NotFoundException(
        `Categoria com id ${id} não pertence a esta empresa`,
      );
    }
    return categoria;
  }

  async update(id: string, empresaId: string, dto: UpdateCategoriaDto) {
    await this.findOne(id, empresaId);
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.categoria.delete({ where: { id } });
  }
}

