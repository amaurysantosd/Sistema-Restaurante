import { Controller, Post, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';
import { ClienteRestricaoService } from './cliente-restricao.service';

@Controller('cliente-restricao')
@UseGuards(ClienteAuthGuard)
export class ClienteRestricaoController {
  constructor(private readonly clienteRestricaoService: ClienteRestricaoService) {}

  @Post(':restricaoId')
  vincularRestricao(@Param('restricaoId') restricaoId: string, @Req() req: any) {
    return this.clienteRestricaoService.vincularRestricao(req.user.clienteId, restricaoId);
  }

  @Get()
  findAllByCliente(@Req() req: any) {
    return this.clienteRestricaoService.findAllByCliente(req.user.clienteId);
  }

  @Delete(':restricaoId')
  desvincularRestricao(@Param('restricaoId') restricaoId: string, @Req() req: any) {
    return this.clienteRestricaoService.desvincularRestricao(req.user.clienteId, restricaoId);
  }
}
