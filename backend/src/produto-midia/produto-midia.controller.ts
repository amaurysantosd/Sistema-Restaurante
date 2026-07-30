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
import { ProdutoMidiaService } from './produto-midia.service';
import { CreateProdutoMidiaDto } from './dto/create-produto-midia.dto';
import { UpdateProdutoMidiaDto } from './dto/update-produto-midia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto-midia')
@UseGuards(JwtAuthGuard)
export class ProdutoMidiaController {
  constructor(private readonly produtoMidiaService: ProdutoMidiaService) {}

  @Post()
  create(@Body() dto: CreateProdutoMidiaDto) {
    return this.produtoMidiaService.create(dto);
  }

  @Get()
  findAllByProduto(@Query('produtoId') produtoId: string) {
    return this.produtoMidiaService.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoMidiaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoMidiaDto) {
    return this.produtoMidiaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoMidiaService.remove(id);
  }
}