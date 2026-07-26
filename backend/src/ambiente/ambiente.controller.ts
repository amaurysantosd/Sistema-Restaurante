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
import { AmbienteService } from './ambiente.service';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ambiente')
@UseGuards(JwtAuthGuard) // Exige token JWT valido em todas as rotas
export class AmbienteController {
  constructor(private readonly ambienteService: AmbienteService) {}

  // Cria ambiente. filialId vem do corpo (dto) -- e o dado sendo enviado, nao um filtro.
  @Post()
  create(@Body() dto: CreateAmbienteDto, @Req() req: any) {
    return this.ambienteService.create(dto, req.user.empresaId);
  }

  // Lista ambientes da empresa do token (validado via join com Filial no Service)
  @Get()
  findAll(@Req() req: any) {
    return this.ambienteService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ambienteService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateAmbienteDto) {
    return this.ambienteService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.ambienteService.remove(id, req.user.empresaId);
  }
}