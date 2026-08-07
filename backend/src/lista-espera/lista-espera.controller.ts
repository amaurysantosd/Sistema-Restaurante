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
import { StatusListaEspera } from '@prisma/client';
import { ListaEsperaService } from './lista-espera.service';
import { CreateListaEsperaDto } from './dto/create-lista-espera.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lista-espera')
@UseGuards(JwtAuthGuard)
export class ListaEsperaController {
  constructor(private readonly listaEsperaService: ListaEsperaService) {}

  @Post()
  criar(@Body() dto: CreateListaEsperaDto, @Req() req: any) {
    return this.listaEsperaService.criar(dto, req.user.empresaId);
  }

  @Get()
  findAllByFilial(
    @Query('filialId') filialId: string,
    @Query('status') status: StatusListaEspera | undefined,
    @Req() req: any,
  ) {
    return this.listaEsperaService.findAllByFilial(filialId, req.user.empresaId, status);
  }

  @Patch(':id/chamar')
  chamar(@Param('id') id: string, @Req() req: any) {
    return this.listaEsperaService.chamar(id, req.user.empresaId);
  }

  @Patch(':id/atender')
  atender(@Param('id') id: string, @Req() req: any) {
    return this.listaEsperaService.atender(id, req.user.empresaId);
  }

  @Patch(':id/desistir')
  desistir(@Param('id') id: string, @Req() req: any) {
    return this.listaEsperaService.desistir(id, req.user.empresaId);
  }
}
