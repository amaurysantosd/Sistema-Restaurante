import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';

@Injectable()
export class ComboService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComboDto, empresaId: string) {
    const filial = await this.prisma.filial.findUnique({ where: { id: dto.filialId } });

    if (!filial || filial.empresaId !== empresaId) {
      throw new BadRequestException('Filial informada não existe');
    }

    return this.prisma.combo.create({ data: dto });
  }

  // Lista combos de uma filial, ja incluindo os itens (produtos) que os compoem
  findAll(filialId: string) {
    return this.prisma.combo.findMany({
      where: { filialId },
      include: { itens: { include: { produto: true } } },
    });
  }

  async findOne(id: string, filialId: string) {
    const combo = await this.prisma.combo.findFirst({
      where: { id, filialId },
      include: { itens: { include: { produto: true } } },
    });

    if (!combo) {
      throw new NotFoundException(`Combo com id ${id} não encontrado`);
    }

    return combo;
  }

  async update(id: string, filialId: string, dto: UpdateComboDto) {
    await this.findOne(id, filialId);
    return this.prisma.combo.update({ where: { id }, data: dto });
  }

  async remove(id: string, filialId: string) {
    await this.findOne(id, filialId);
    return this.prisma.combo.delete({ where: { id } });
  }
}