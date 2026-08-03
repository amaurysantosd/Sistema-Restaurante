import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConsumoClienteService } from './consumo-cliente.service';
import { CreateConsumoClienteDto } from './dto/create-consumo-cliente.dto';

@Controller('consumo-cliente')
export class ConsumoClienteController {
  constructor(private readonly consumoClienteService: ConsumoClienteService) {}

  // Guard do CLIENTE, nao do staff -- o proprio cliente marca o que consumiu.
  @Post()
  @UseGuards(ClienteAuthGuard)
  marcar(@Body() dto: CreateConsumoClienteDto, @Req() req: any) {
    return this.consumoClienteService.marcar(req.user.clienteId, dto);
  }

  @Get()
  @UseGuards(ClienteAuthGuard)
  findAllByCliente(@Req() req: any) {
    return this.consumoClienteService.findAllByCliente(req.user.clienteId);
  }

  @Delete(':id')
  @UseGuards(ClienteAuthGuard)
  remover(@Param('id') id: string, @Req() req: any) {
    return this.consumoClienteService.remover(req.user.clienteId, id);
  }

  // Staff (garcom da area) consulta o consumo marcado numa mesa -- guard do
  // USUARIO, so retorna dado se a Filial tiver habilitado essa visualizacao.
  @Get('mesa/:mesaId')
  @UseGuards(JwtAuthGuard)
  findAllByMesaParaStaff(@Param('mesaId') mesaId: string, @Req() req: any) {
    return this.consumoClienteService.findAllByMesaParaStaff(mesaId, req.user.empresaId);
  }
}
