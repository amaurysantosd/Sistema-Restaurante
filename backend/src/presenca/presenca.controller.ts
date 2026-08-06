import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PresencaService } from './presenca.service';

// Sem rota de criacao manual -- SessaoPresenca so nasce via check-in
// automatico no QR Code (ver MesaController).
@Controller('sessao-presenca')
@UseGuards(JwtAuthGuard)
export class PresencaController {
  constructor(private readonly presencaService: PresencaService) {}

  @Get()
  findAllAtivas(@Query('filialId') filialId: string, @Req() req: any) {
    return this.presencaService.findAllAtivasPorFilial(filialId, req.user.empresaId);
  }
}
