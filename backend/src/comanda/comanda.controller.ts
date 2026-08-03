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
import { ComandaService } from './comanda.service';
import { ItemComandaService } from './item-comanda.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { CreateItemComandaDto } from './dto/create-item-comanda.dto';
import { UpdateItemStatusDto } from './dto/update-item-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Pedido/Comanda e sempre criado e gerenciado pelo garcom (Usuario) -- nunca
// pelo Cliente. Controller inteiro protegido por JwtAuthGuard, sem rotas
// publicas.
@Controller('comanda')
@UseGuards(JwtAuthGuard)
export class ComandaController {
  constructor(
    private readonly comandaService: ComandaService,
    private readonly itemComandaService: ItemComandaService,
  ) {}

  @Post()
  abrir(@Body() dto: CreateComandaDto, @Req() req: any) {
    return this.comandaService.abrir(dto, req.user.empresaId, req.user.id);
  }

  @Get()
  findAllByMesa(@Query('mesaId') mesaId: string, @Req() req: any) {
    return this.comandaService.findAllByMesa(mesaId, req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.comandaService.findOne(id, req.user.empresaId);
  }

  @Patch(':id/fechar')
  fechar(@Param('id') id: string, @Req() req: any) {
    return this.comandaService.fechar(id, req.user.empresaId);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string, @Req() req: any) {
    return this.comandaService.cancelar(id, req.user.empresaId);
  }

  @Post(':comandaId/item')
  adicionarItem(
    @Param('comandaId') comandaId: string,
    @Body() dto: CreateItemComandaDto,
    @Req() req: any,
  ) {
    return this.itemComandaService.adicionar(comandaId, req.user.empresaId, req.user.id, dto);
  }

  @Patch('item/:id/status')
  atualizarStatusItem(@Param('id') id: string, @Body() dto: UpdateItemStatusDto, @Req() req: any) {
    return this.itemComandaService.atualizarStatus(id, req.user.empresaId, dto.status);
  }
}
