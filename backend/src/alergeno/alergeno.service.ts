import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlergenoDto } from './dto/create-alergeno.dto';
import { UpdateAlergenoDto } from './dto/update-alergeno.dto';

@Injectable()
export class AlergenoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAlergenoDto) {
    return this.prisma.alergeno.create({ data: dto });
  }

  // Lista os alergenos da empresa do token
  findAll(empresaId: string) {
    return this.prisma.alergeno.findMany({ where: { empresaId } });
  }

  async findOne(id: string, empresaId: string) {
    const alergeno = await this.prisma.alergeno.findUnique({ where: { id } });

    if (!alergeno || alergeno.empresaId !== empresaId) {
      throw new NotFoundException(`Alergeno com id ${id} não encontrado`);
    }

    return alergeno;
  }

  async update(id: string, empresaId: string, dto: UpdateAlergenoDto) {
    await this.findOne(id, empresaId);
    return this.prisma.alergeno.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.alergeno.delete({ where: { id } });
  }
}