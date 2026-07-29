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
import { AlergenoService } from './alergeno.service';
import { CreateAlergenoDto } from './dto/create-alergeno.dto';
import { UpdateAlergenoDto } from './dto/update-alergeno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alergeno')
@UseGuards(JwtAuthGuard)
export class AlergenoController {
  constructor(private readonly alergenoService: AlergenoService) {}

  @Post()
  create(@Body() dto: CreateAlergenoDto) {
    return this.alergenoService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.alergenoService.findAll(req.user.empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.alergenoService.findOne(id, req.user.empresaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateAlergenoDto) {
    return this.alergenoService.update(id, req.user.empresaId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.alergenoService.remove(id, req.user.empresaId);
  }
}