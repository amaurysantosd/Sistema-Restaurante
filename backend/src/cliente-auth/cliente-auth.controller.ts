import { Controller, Post, Body } from '@nestjs/common';
import { ClienteAuthService } from './cliente-auth.service';
import { CadastroClienteDto } from './dto/cadastro-cliente.dto';
import { Public } from '../auth/public.decorator';

@Controller('cliente-auth')
export class ClienteAuthController {
  constructor(private readonly clienteAuthService: ClienteAuthService) {}

  // Rota PUBLICA -- o cliente ainda nao tem token nenhum neste momento.
  // Cadastra (se novo) ou loga (se ja existe, encontrado por telefone/
  // email/cpf) e retorna o token proprio do Cliente.
  @Public()
  @Post('cadastro')
  cadastroOuLogin(@Body() dto: CadastroClienteDto) {
    return this.clienteAuthService.cadastroOuLogin(dto);
  }
}