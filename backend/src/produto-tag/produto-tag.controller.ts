import { Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ProdutoTagService } from './produto-tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto')
@UseGuards(JwtAuthGuard)
export class ProdutoTagController {
  constructor(private readonly service: ProdutoTagService) {}

  @Post(':produtoId/tag/:tagId')
  conectar(@Param('produtoId') produtoId: string, @Param('tagId') tagId: string) {
    return this.service.conectar(produtoId, tagId);
  }

  @Get(':produtoId/tag')
  findAllByProduto(@Param('produtoId') produtoId: string) {
    return this.service.findAllByProduto(produtoId);
  }

  @Delete(':produtoId/tag/:tagId')
  desconectar(@Param('produtoId') produtoId: string, @Param('tagId') tagId: string) {
    return this.service.desconectar(produtoId, tagId);
  }
}