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
import { ContaRecebimentoService } from './conta-recebimento.service';
import { CreateContaRecebimentoDto } from './dto/create-conta-recebimento.dto';
import { UpdateContaRecebimentoDto } from './dto/update-conta-recebimento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conta-recebimento')
@UseGuards(JwtAuthGuard)
export class ContaRecebimentoController {
  constructor(private readonly contaRecebimentoService: ContaRecebimentoService) {}

  @Post()
  create(@Body() dto: CreateContaRecebimentoDto, @Req() req: any) {
    return this.contaRecebimentoService.create(dto, req.user.empresaId, req.user.perfil);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.contaRecebimentoService.findAll(req.user.empresaId, req.user.perfil);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.contaRecebimentoService.findOne(id, req.user.empresaId, req.user.perfil);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateContaRecebimentoDto) {
    return this.contaRecebimentoService.update(id, req.user.empresaId, req.user.perfil, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.contaRecebimentoService.remove(id, req.user.empresaId);
  }
}
