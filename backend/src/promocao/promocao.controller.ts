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
} from '@nestjs/common';
import { PromocaoService } from './promocao.service';
import { CreatePromocaoDto } from './dto/create-promocao.dto';
import { UpdatePromocaoDto } from './dto/update-promocao.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('promocao')
@UseGuards(JwtAuthGuard)
export class PromocaoController {
  constructor(private readonly promocaoService: PromocaoService) {}

  @Post()
  create(@Body() dto: CreatePromocaoDto) {
    return this.promocaoService.create(dto);
  }

  @Get()
  findAllByProduto(@Query('produtoId') produtoId: string) {
    return this.promocaoService.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promocaoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromocaoDto) {
    return this.promocaoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promocaoService.remove(id);
  }
}