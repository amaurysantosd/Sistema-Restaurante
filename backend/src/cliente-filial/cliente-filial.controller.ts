import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClienteFilialService } from './cliente-filial.service';
import { AjustarClienteFilialDto } from './dto/ajustar-cliente-filial.dto';

@Controller('cliente-filial')
export class ClienteFilialController {
  constructor(private readonly clienteFilialService: ClienteFilialService) {}

  // Cliente ve seus proprios pontos/saldo em cada filial onde ja tem vinculo.
  // Guard do CLIENTE, nao do staff.
  @Get()
  @UseGuards(ClienteAuthGuard)
  findAllByCliente(@Req() req: any) {
    return this.clienteFilialService.findAllByCliente(req.user.clienteId);
  }

  // Staff credita/debita pontos e cashback de um cliente numa filial da
  // propria empresa. Guard do USUARIO (staff), nao do cliente.
  @Post(':filialId/:clienteId/ajustar')
  @UseGuards(JwtAuthGuard)
  ajustar(
    @Param('filialId') filialId: string,
    @Param('clienteId') clienteId: string,
    @Body() dto: AjustarClienteFilialDto,
    @Req() req: any,
  ) {
    return this.clienteFilialService.ajustar(req.user.empresaId, filialId, clienteId, dto);
  }
}
