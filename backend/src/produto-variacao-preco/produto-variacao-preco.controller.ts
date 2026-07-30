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
import { ProdutoVariacaoPrecoService } from './produto-variacao-preco.service';
import { CreateProdutoVariacaoPrecoDto } from './dto/create-produto-variacao-preco.dto';
import { UpdateProdutoVariacaoPrecoDto } from './dto/update-produto-variacao-preco.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto-variacao-preco')
@UseGuards(JwtAuthGuard)
export class ProdutoVariacaoPrecoController {
  constructor(
    private readonly produtoVariacaoPrecoService: ProdutoVariacaoPrecoService,
  ) {}

  @Post()
  create(@Body() dto: CreateProdutoVariacaoPrecoDto) {
    return this.produtoVariacaoPrecoService.create(dto);
  }

  // Lista as variacoes de um produto especifico, via query string
  @Get()
  findAllByProduto(@Query('produtoId') produtoId: string) {
    return this.produtoVariacaoPrecoService.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoVariacaoPrecoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoVariacaoPrecoDto) {
    return this.produtoVariacaoPrecoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoVariacaoPrecoService.remove(id);
  }
}