import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTagDto) {
    return this.prisma.tag.create({ data: dto });
  }

  // Lista as tags da empresa do token
  findAll(empresaId: string) {
    return this.prisma.tag.findMany({ where: { empresaId } });
  }

  async findOne(id: string, empresaId: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag || tag.empresaId !== empresaId) {
      throw new NotFoundException(`Tag com id ${id} não encontrada`);
    }

    return tag;
  }

  async update(id: string, empresaId: string, dto: UpdateTagDto) {
    await this.findOne(id, empresaId);
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.tag.delete({ where: { id } });
  }
}