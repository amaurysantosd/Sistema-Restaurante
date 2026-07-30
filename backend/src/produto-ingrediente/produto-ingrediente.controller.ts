import { Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutoIngredienteService } from './produto-ingrediente.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto')
@UseGuards(JwtAuthGuard)
export class ProdutoIngredienteController {
  constructor(private readonly service: ProdutoIngredienteService) {}

  @Post(':produtoId/ingrediente/:ingredienteId')
  conectar(
    @Param('produtoId') produtoId: string,
    @Param('ingredienteId') ingredienteId: string,
  ) {
    return this.service.conectar(produtoId, ingredienteId);
  }

  @Get(':produtoId/ingrediente')
  findAllByProduto(@Param('produtoId') produtoId: string) {
    return this.service.findAllByProduto(produtoId);
  }

  @Delete(':produtoId/ingrediente/:ingredienteId')
  desconectar(
    @Param('produtoId') produtoId: string,
    @Param('ingredienteId') ingredienteId: string,
  ) {
    return this.service.desconectar(produtoId, ingredienteId);
  }
}