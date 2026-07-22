import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

 /* Define que esta classe controla as rotas /categoria.
 Controller Significa que todas as rotas começam com /categoria */
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}
  /* "Eu preciso de um CategoriaService para que esta classe funcione. E o Nest responde: 
  "Tudo bem, eu crio um para você."" */

  /* Diz ao NestJS: "Quando chegar uma requisição HTTP do tipo POST nesta rota,
   execute o método logo abaixo." */
  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto);
  }

  /* É responsável por listar todas as categorias. o Controller solicita ao Service
   todas as categorias pertencentes à empresa informada e devolve o resultado. */
  @Get()
  findAll(@Query('empresaId') empresaId: string) {
    return this.categoriaService.findAll(empresaId);
    /* "CategoriaService, me traga todas as categorias dessa empresa." */
  }

  /* É responsável por buscar uma única categoria.
  o Controller pega o identificador da categoria e pede ao Service para localizar aquele registro específico. */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
  ) {
    return this.categoriaService.findOne(id, empresaId);
  }

  /* É responsável por alterar uma categoria existente. 
  com os novos dados, o Controller envia essas informações ao Service para que a atualização seja realizada. */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
    @Body() dto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, empresaId, dto);
  }

  /* É responsável por remover uma categoria. */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
  ) {
    return this.categoriaService.remove(id, empresaId);
  }
}
