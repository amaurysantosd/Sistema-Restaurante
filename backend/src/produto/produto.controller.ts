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
  Req,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produto')
@UseGuards(JwtAuthGuard)
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  // empresaId do token e usado para validar que Filial/Categoria pertencem a ela
  @Post()
  create(@Body() dto: CreateProdutoDto, @Req() req: any) {
    return this.produtoService.create(dto, req.user.empresaId);
  }

  // filialId vem via query string, pois o cardapio e por filial (nao por empresa
  // inteira) -- o usuario logado pode ter acesso a mais de uma filial, entao
  // precisa especificar QUAL filial quer consultar.
  @Get()
  findAll(@Query('filialId') filialId: string) {
    return this.produtoService.findAll(filialId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('filialId') filialId: string) {
    return this.produtoService.findOne(id, filialId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('filialId') filialId: string,
    @Body() dto: UpdateProdutoDto,
  ) {
    return this.produtoService.update(id, filialId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('filialId') filialId: string) {
    return this.produtoService.remove(id, filialId);
  }
}