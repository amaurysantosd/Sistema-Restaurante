import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { FilialService } from './filial.service';
import { CreateFilialDto } from './dto/create-filial.dto';
import { UpdateFilialDto } from './dto/update-filial.dto';

@Controller('filial')/* esse decorator na classe define o prefixo de rota */
export class FilialController {
  constructor(private readonly filialService: FilialService) {}

    /* aqui está o coração da extração de dados. @Body() diz ao Nest "pegue o corpo (JSON)
     da requisição HTTP e me entregue como parâmetro" */
    @Post()
    create(@Body() dto: CreateFilialDto) {
    return this.filialService.create(dto);
    }

    /* FindAll extrair dado da query string em vez do corpo da requisição. */
    @Get()
    findAll(@Query('empresaId') empresaId: string) {
    return this.filialService.findAll(empresaId);
    }

    /* aqui entra a última peça de extração de dados que faltava: @Param(), usada pra pegar 
    valores que vêm dentro do caminho da URL (não da query string, não do corpo). */
    @Get(':id')
    findOne(@Param('id') id: string, @Query('empresaId') empresaId: string) {
    return this.filialService.findOne(id, empresaId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Query('empresaId') empresaId: string,
        @Body() dto: UpdateFilialDto,
    ) {
    return this.filialService.update(id, empresaId, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Query('empresaId') empresaId: string) {
    return this.filialService.remove(id, empresaId);
    }
}