import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuario')
@UseGuards(JwtAuthGuard) // Protege todas as rotas, incluindo a troca de senha
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  // empresaId vem do token (req.user), nao mais de query string
  @Get()
  findAll(@Req() req: any) {
    return this.usuarioService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usuarioService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, req.user.empresaId, dto);
  }

  // Rota separada para troca de senha (decisao tomada anteriormente: exige senha atual)
  @Patch(':id/senha')
  updateSenha(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateSenhaDto) {
    return this.usuarioService.updateSenha(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usuarioService.remove(id, req.user.empresaId);
  }
}