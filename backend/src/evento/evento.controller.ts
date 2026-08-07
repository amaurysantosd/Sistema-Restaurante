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
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('evento')
@UseGuards(JwtAuthGuard)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  create(@Body() dto: CreateEventoDto, @Req() req: any) {
    return this.eventoService.create(dto, req.user.empresaId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.eventoService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.eventoService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateEventoDto) {
    return this.eventoService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventoService.remove(id, req.user.empresaId);
  }
}
