import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

 /* Define que esta classe controla as rotas /categoria.
 Controller Significa que todas as rotas começam com /categoria */
@Controller('categoria')
@UseGuards(JwtAuthGuard) // Exige token JWT valido em todas as rotas deste controller
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}
  /* "Eu preciso de um CategoriaService para que esta classe funcione. E o Nest responde: 
  "Tudo bem, eu crio um para você."" */

  /* Diz ao NestJS: "Quando chegar uma requisição HTTP do tipo POST nesta rota,
   execute o método logo abaixo." */
 // Cria categoria. empresaId vem do corpo (dto), pois e dado enviado pelo cliente na criacao.
  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto);
  }

  /* É responsável por listar todas as categorias. o Controller solicita ao Service
   todas as categorias pertencentes à empresa informada e devolve o resultado. */
// Lista categorias da empresa do usuario logado (empresaId extraido do token, nao da URL)
  @Get()
  findAll(@Req() req: any) {
    return this.categoriaService.findAll(req.user.empresaId);
    /* "CategoriaService, me traga todas as categorias dessa empresa." */
  }


  /* É responsável por buscar uma única categoria.
  o Controller pega o identificador da categoria e pede ao Service para localizar aquele registro específico. */
 // Busca uma categoria, validando isolamento por empresa do token
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.categoriaService.findOne(id, req.user.empresaId);
  }

  /* É responsável por alterar uma categoria existente. 
  com os novos dados, o Controller envia essas informações ao Service para que a atualização seja realizada. */
  // Atualiza categoria, mesmo isolamento
  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(id, req.user.empresaId, dto);
  }


  /* É responsável por remover uma categoria. */
  // Remove categoria, mesmo isolamento
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.categoriaService.remove(id, req.user.empresaId);
  }
}
