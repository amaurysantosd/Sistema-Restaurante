import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';

const usuarioSemSenhaSelect = {
  id: true,
  nome: true,
  email: true,
  perfil: true,
  ativo: true,
  empresaId: true,
  filialId: true,
  createdAt: true,
  updatedAt: true,
  // senha propositalmente omitido
};

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const { senha, ...resto } = dto;

    return this.prisma.usuario.create({
      data: { ...resto, senha: senhaHash },
      select: usuarioSemSenhaSelect,
    });
  }

  findAll(empresaId: string) {
    return this.prisma.usuario.findMany({
      where: { empresaId },
      select: usuarioSemSenhaSelect,
    });
  }

  async findOne(id: string, empresaId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: usuarioSemSenhaSelect,
    });

    if (!usuario || usuario.empresaId !== empresaId) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return usuario;
  }

  async update(id: string, empresaId: string, dto: UpdateUsuarioDto) {
    await this.findOne(id, empresaId);

    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: usuarioSemSenhaSelect,
    });
  }

  async remove(id: string, empresaId: string) {
    await this.findOne(id, empresaId);
    return this.prisma.usuario.delete({ where: { id } });
  }

  async updateSenha(id: string, empresaId: string, dto: UpdateSenhaDto) {
  const usuario = await this.prisma.usuario.findUnique({ where: { id } });

  if (!usuario || usuario.empresaId !== empresaId) {
    throw new NotFoundException(`Usuário com id ${id} não encontrado`);
  }

  const senhaConfere = await bcrypt.compare(dto.senhaAtual, usuario.senha);

  if (!senhaConfere) {
    throw new UnauthorizedException('Senha atual incorreta');
  }

  const novoHash = await bcrypt.hash(dto.novaSenha, 10);

  await this.prisma.usuario.update({
    where: { id },
    data: { senha: novoHash },
  });

  return { mensagem: 'Senha atualizada com sucesso' };
}
}