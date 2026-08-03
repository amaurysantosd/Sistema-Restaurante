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
import { TipoChamadoService } from './tipo-chamado.service';
import { CreateTipoChamadoDto } from './dto/create-tipo-chamado.dto';
import { UpdateTipoChamadoDto } from './dto/update-tipo-chamado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tipo-chamado')
@UseGuards(JwtAuthGuard)
export class TipoChamadoController {
  constructor(private readonly tipoChamadoService: TipoChamadoService) {}

  @Post()
  create(@Body() dto: CreateTipoChamadoDto) {
    return this.tipoChamadoService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.tipoChamadoService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.tipoChamadoService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTipoChamadoDto) {
    return this.tipoChamadoService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tipoChamadoService.remove(id, req.user.empresaId);
  }
}
