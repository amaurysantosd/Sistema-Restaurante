import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilialDto } from './dto/create-filial.dto';
import { UpdateFilialDto } from './dto/update-filial.dto';

@Injectable()
export class FilialService {
  constructor(private readonly prisma: PrismaService) {}

    create(dto: CreateFilialDto) {
    return this.prisma.filial.create({ data: dto });
    }

  findAll(empresaId: string) {
    if (!empresaId) {
      throw new BadRequestException('empresaId é obrigatório');
    }
    return this.prisma.filial.findMany({ where: { empresaId } });
  }

    async findOne(id: string, empresaId: string) {
    const filial = await this.prisma.filial.findUnique({ where: { id } });

    if (!filial || filial.empresaId !== empresaId) {
        throw new NotFoundException(`Filial com id ${id} não encontrada`);
    }

    return filial;
    }

    async update(id: string, empresaId: string, dto: UpdateFilialDto) {
    await this.findOne(id, empresaId); // garante que existe e pertence à empresa
    return this.prisma.filial.update({ where: { id }, data: dto });
    }

    async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.filial.delete({ where: { id } });
    }
}