import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CreateReservaStaffDto } from './dto/create-reserva-staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClienteAuthGuard } from '../cliente-auth/cliente-auth.guard';

// Reserva pode ser criada pelo staff OU pelo proprio Cliente -- primeira
// entidade do sistema com criacao dupla. Por isso este controller mistura
// rotas com JwtAuthGuard (staff) e ClienteAuthGuard (cliente), sem guard
// unico de classe.
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  criarComoStaff(@Body() dto: CreateReservaStaffDto, @Req() req: any) {
    return this.reservaService.criarComoStaff(dto, req.user.id);
  }

  @Post('minha')
  @UseGuards(ClienteAuthGuard)
  criarComoCliente(@Body() dto: CreateReservaDto, @Req() req: any) {
    return this.reservaService.criarComoCliente(dto, req.user.clienteId);
  }

  @Get('minha')
  @UseGuards(ClienteAuthGuard)
  findAllMinhas(@Req() req: any) {
    return this.reservaService.findAllMinhas(req.user.clienteId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByFilial(@Query('filialId') filialId: string, @Req() req: any) {
    return this.reservaService.findAllByFilial(filialId, req.user.empresaId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.reservaService.findOne(id, req.user.empresaId);
  }

  @Patch(':id/confirmar-sinal')
  @UseGuards(JwtAuthGuard)
  confirmarSinal(@Param('id') id: string, @Req() req: any) {
    return this.reservaService.confirmarSinal(id, req.user.empresaId);
  }

  @Patch(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  cancelar(@Param('id') id: string, @Req() req: any) {
    return this.reservaService.cancelar(id, req.user.empresaId);
  }
}
