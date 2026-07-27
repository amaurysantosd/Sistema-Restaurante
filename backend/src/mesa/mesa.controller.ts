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

@Controller('mesa')
@UseGuards(JwtAuthGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  // Rota PUBLICA: o @Public() sobrescreve o @UseGuards da classe,
  // liberando esta rota especifica sem exigir token.
  // Usada pelo cliente do restaurante ao escanear o QR Code da mesa.
  @Public()
  @Get('qrcode/:codigo')
  buscarPorQrCode(@Param('codigo') codigo: string) {
    return this.mesaService.buscarPorQrCode(codigo);
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