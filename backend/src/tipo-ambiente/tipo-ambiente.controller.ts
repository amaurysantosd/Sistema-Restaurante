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
import { TipoAmbienteService } from './tipo-ambiente.service';
import { CreateTipoAmbienteDto } from './dto/create-tipo-ambiente.dto';
import { UpdateTipoAmbienteDto } from './dto/update-tipo-ambiente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tipo-ambiente')
@UseGuards(JwtAuthGuard)
export class TipoAmbienteController {
  constructor(private readonly tipoAmbienteService: TipoAmbienteService) {}

  @Post()
  create(@Body() dto: CreateTipoAmbienteDto) {
    return this.tipoAmbienteService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.tipoAmbienteService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.tipoAmbienteService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTipoAmbienteDto) {
    return this.tipoAmbienteService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tipoAmbienteService.remove(id, req.user.empresaId);
  }
}