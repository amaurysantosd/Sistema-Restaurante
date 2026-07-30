import { Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutoAlergenoService } from './produto-alergeno.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto')
@UseGuards(JwtAuthGuard)
export class ProdutoAlergenoController {
  constructor(private readonly service: ProdutoAlergenoService) {}

  @Post(':produtoId/alergeno/:alergenoId')
  conectar(
    @Param('produtoId') produtoId: string,
    @Param('alergenoId') alergenoId: string,
  ) {
    return this.service.conectar(produtoId, alergenoId);
  }

  @Get(':produtoId/alergeno')
  findAllByProduto(@Param('produtoId') produtoId: string) {
    return this.service.findAllByProduto(produtoId);
  }

  @Delete(':produtoId/alergeno/:alergenoId')
  desconectar(
    @Param('produtoId') produtoId: string,
    @Param('alergenoId') alergenoId: string,
  ) {
    return this.service.desconectar(produtoId, alergenoId);
  }
}