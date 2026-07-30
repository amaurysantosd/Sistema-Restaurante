import { Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutoHarmonizacaoService } from './produto-harmonizacao.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto')
@UseGuards(JwtAuthGuard)
export class ProdutoHarmonizacaoController {
  constructor(private readonly service: ProdutoHarmonizacaoService) {}

  @Post(':produtoId/harmonizacao/:produtoHarmonizadoId')
  conectar(
    @Param('produtoId') produtoId: string,
    @Param('produtoHarmonizadoId') produtoHarmonizadoId: string,
  ) {
    return this.service.conectar(produtoId, produtoHarmonizadoId);
  }

  @Get(':produtoId/harmonizacao')
  findAllByProduto(@Param('produtoId') produtoId: string) {
    return this.service.findAllByProduto(produtoId);
  }

  @Delete(':produtoId/harmonizacao/:produtoHarmonizadoId')
  desconectar(
    @Param('produtoId') produtoId: string,
    @Param('produtoHarmonizadoId') produtoHarmonizadoId: string,
  ) {
    return this.service.desconectar(produtoId, produtoHarmonizadoId);
  }
}