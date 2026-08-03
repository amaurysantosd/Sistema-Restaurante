import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';
import { HistoricoVisitaService } from './historico-visita.service';

@Controller('historico-visita')
@UseGuards(ClienteAuthGuard)
export class HistoricoVisitaController {
  constructor(private readonly historicoVisitaService: HistoricoVisitaService) {}

  @Post(':filialId')
  registrarVisita(
    @Param('filialId') filialId: string,
    @Body() body: { mesaId?: string },
    @Req() req: any,
  ) {
    return this.historicoVisitaService.registrarVisita(req.user.clienteId, filialId, body?.mesaId);
  }

  @Get()
  findAllByCliente(@Req() req: any) {
    return this.historicoVisitaService.findAllByCliente(req.user.clienteId);
  }

  @Delete(':id')
  removerVisita(@Param('id') id: string, @Req() req: any) {
    return this.historicoVisitaService.removerVisita(req.user.clienteId, id);
  }
}
