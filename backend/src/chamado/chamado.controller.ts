import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StatusChamado } from '@prisma/client';
import { ChamadoService } from './chamado.service';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('chamado')
@UseGuards(JwtAuthGuard)
export class ChamadoController {
  constructor(private readonly chamadoService: ChamadoService) {}

  // Rota PUBLICA: o cliente escaneia o QR da mesa e chama o garcom/pede a
  // conta sem precisar de cadastro/login -- mesmo espirito do
  // GET /mesa/qrcode/:codigo.
  @Public()
  @Post('mesa/:mesaId')
  criar(@Param('mesaId') mesaId: string, @Body() dto: CreateChamadoDto) {
    return this.chamadoService.criar(mesaId, dto.tipoChamadoId);
  }

  @Get()
  findAll(
    @Query('filialId') filialId: string,
    @Query('status') status: StatusChamado | undefined,
    @Req() req: any,
  ) {
    return this.chamadoService.findAll(filialId, req.user.empresaId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.chamadoService.findOne(id, req.user.empresaId);
  }

  @Patch(':id/atender')
  atender(@Param('id') id: string, @Req() req: any) {
    return this.chamadoService.atender(id, req.user.empresaId, req.user.id);
  }

  @Patch(':id/concluir')
  concluir(@Param('id') id: string, @Req() req: any) {
    return this.chamadoService.concluir(id, req.user.empresaId, req.user.id);
  }
}
