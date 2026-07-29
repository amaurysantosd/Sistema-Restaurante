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
import { IngredienteService } from './ingrediente.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ingrediente')
@UseGuards(JwtAuthGuard) // Exige token JWT valido em todas as rotas
export class IngredienteController {
  constructor(private readonly ingredienteService: IngredienteService) {}

  @Post()
  create(@Body() dto: CreateIngredienteDto) {
    return this.ingredienteService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.ingredienteService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ingredienteService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateIngredienteDto) {
    return this.ingredienteService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.ingredienteService.remove(id, req.user.empresaId);
  }
}