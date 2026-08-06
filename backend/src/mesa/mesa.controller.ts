import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator'; // NOVO
import { OptionalClienteAuthGuard } from '../cliente-auth/optional-cliente-auth.guard';
import { PresencaService } from '../presenca/presenca.service';

@Controller('mesa')
@UseGuards(JwtAuthGuard)
export class MesaController {
  constructor(
    private readonly mesaService: MesaService,
    private readonly presencaService: PresencaService,
  ) {}

  // Rota PUBLICA: o @Public() sobrescreve o @UseGuards(JwtAuthGuard) da
  // classe, liberando esta rota sem exigir token de staff. O
  // OptionalClienteAuthGuard, por sua vez, NUNCA bloqueia -- so tenta
  // reconhecer um cliente logado (req.user), pra disparar o check-in de
  // presenca quando houver. Sem token de cliente (ou invalido), o
  // comportamento e identico ao de antes da Fase 5: so retorna os dados do
  // cardapio/mesa, sem criar sessao.
  @Public()
  @UseGuards(OptionalClienteAuthGuard)
  @Get('qrcode/:codigo')
  async buscarPorQrCode(@Param('codigo') codigo: string, @Req() req: any) {
    const resultado = await this.mesaService.buscarPorQrCode(codigo);

    if (req.user?.clienteId) {
      await this.presencaService.checkIn(req.user.clienteId, resultado.mesa.id);
    }

    return resultado;
  }

  @Post()
  create(@Body() dto: CreateMesaDto, @Req() req: any) {
    return this.mesaService.create(dto, req.user.empresaId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.mesaService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.mesaService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateMesaDto) {
    return this.mesaService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.mesaService.remove(id, req.user.empresaId);
  }
}