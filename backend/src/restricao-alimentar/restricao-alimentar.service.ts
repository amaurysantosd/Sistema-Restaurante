import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestricaoAlimentarDto } from './dto/create-restricao-alimentar.dto';
import { UpdateRestricaoAlimentarDto } from './dto/update-restricao-alimentar.dto';

@Injectable()
export class RestricaoAlimentarService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRestricaoAlimentarDto) {
    return this.prisma.restricaoAlimentar.create({ data: dto });
  }

  // Sem isolamento por empresa -- e catalogo global, qualquer usuario
  // autenticado pode consultar (mas so administradores da plataforma
  // deveriam poder criar/editar -- ver pendencia de permissao abaixo)
  findAll() {
    return this.prisma.restricaoAlimentar.findMany();
  }

  async findOne(id: string) {
    const restricao = await this.prisma.restricaoAlimentar.findUnique({ where: { id } });

    if (!restricao) {
      throw new NotFoundException(`Restrição alimentar com id ${id} não encontrada`);
    }

    return restricao;
  }

  async update(id: string, dto: UpdateRestricaoAlimentarDto) {
    await this.findOne(id);
    return this.prisma.restricaoAlimentar.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.restricaoAlimentar.delete({ where: { id } });
  }
}