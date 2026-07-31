import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RestricaoAlimentarService } from './restricao-alimentar.service';
import { CreateRestricaoAlimentarDto } from './dto/create-restricao-alimentar.dto';
import { UpdateRestricaoAlimentarDto } from './dto/update-restricao-alimentar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { Public } from '../auth/public.decorator';

@Controller('restricao-alimentar')
export class RestricaoAlimentarController {
  constructor(private readonly service: RestricaoAlimentarService) {}

  // Publico: qualquer cliente, de qualquer restaurante, sem login nenhum,
  // consegue ver a lista para se cadastrar/marcar restricoes
  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Restrito: exige login E superAdmin=true
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post()
  create(@Body() dto: CreateRestricaoAlimentarDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRestricaoAlimentarDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}