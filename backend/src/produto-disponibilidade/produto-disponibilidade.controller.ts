import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProdutoDisponibilidadeService } from './produto-disponibilidade.service';
import { CreateProdutoDisponibilidadeDto } from './dto/create-produto-disponibilidade.dto';
import { UpdateProdutoDisponibilidadeDto } from './dto/update-produto-disponibilidade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto-disponibilidade')
@UseGuards(JwtAuthGuard)
export class ProdutoDisponibilidadeController {
  constructor(private readonly service: ProdutoDisponibilidadeService) {}

  @Post()
  create(@Body() dto: CreateProdutoDisponibilidadeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAllByProduto(@Query('produtoId') produtoId: string) {
    return this.service.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoDisponibilidadeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}