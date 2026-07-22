import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  @Get()
  findAll(@Query('empresaId') empresaId: string) {
    return this.usuarioService.findAll(empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('empresaId') empresaId: string) {
    return this.usuarioService.findOne(id, empresaId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, empresaId, dto);
  }

  @Patch(':id/senha')
  updateSenha(
    @Param('id') id: string,
    @Query('empresaId') empresaId: string,
    @Body() dto: UpdateSenhaDto,
  ) {
    return this.usuarioService.updateSenha(id, empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('empresaId') empresaId: string) {
    return this.usuarioService.remove(id, empresaId);
  }
}