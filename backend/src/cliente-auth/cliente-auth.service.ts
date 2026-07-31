import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CadastroClienteDto } from './dto/cadastro-cliente.dto';

@Injectable()
export class ClienteAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Cadastra um cliente novo OU reaproveita um existente (buscando por
  // telefone, email ou cpf, o que tiver sido informado), completando
  // campos vazios sem sobrescrever dados ja preenchidos. Retorna sempre
  // um token JWT proprio do Cliente (payload minimo: so o id).
  async cadastroOuLogin(dto: CadastroClienteDto) {
    const clienteExistente = await this.prisma.cliente.findFirst({
      where: {
        OR: [
          { telefone: dto.telefone },
          dto.email ? { email: dto.email } : undefined,
          dto.cpf ? { cpf: dto.cpf } : undefined,
        ].filter(Boolean) as any,
      },
    });

    let cliente;

    if (clienteExistente) {
      // Encontrou: completa campos vazios com os dados novos, sem
      // sobrescrever o que ja estava preenchido
      cliente = await this.prisma.cliente.update({
        where: { id: clienteExistente.id },
        data: {
          nome: clienteExistente.nome ?? dto.nome,
          telefone: clienteExistente.telefone ?? dto.telefone,
          email: clienteExistente.email ?? dto.email,
          cpf: clienteExistente.cpf ?? dto.cpf,
          aceitaMarketing: dto.aceitaMarketing ?? clienteExistente.aceitaMarketing,
        },
      });
    } else {
      // Nao encontrou: cria um cliente novo
      cliente = await this.prisma.cliente.create({ data: dto });
    }

    // Token proprio do Cliente. "tipo: cliente" e uma marca extra no
    // payload para diferenciar de tokens de Usuario (staff), caso
    // precisemos inspecionar isso em algum lugar no futuro.
    const token = await this.jwtService.signAsync({
      sub: cliente.id,
      tipo: 'cliente',
    });

    return { access_token: token, cliente };
  }
}