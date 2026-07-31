import { Controller, Post, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';

@Controller('favorito')
@UseGuards(ClienteAuthGuard) // Protegido pelo Guard do CLIENTE, nao do Usuario/staff
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  @Post(':produtoId')
  favoritar(@Param('produtoId') produtoId: string, @Req() req: any) {
    return this.favoritoService.favoritar(req.user.clienteId, produtoId);
  }

  @Get()
  findAllByCliente(@Req() req: any) {
    return this.favoritoService.findAllByCliente(req.user.clienteId);
  }

  @Delete(':produtoId')
  desfavoritar(@Param('produtoId') produtoId: string, @Req() req: any) {
    return this.favoritoService.desfavoritar(req.user.clienteId, produtoId);
  }
}