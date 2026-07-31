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
  Req,
} from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('combo')
@UseGuards(JwtAuthGuard)
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  create(@Body() dto: CreateComboDto, @Req() req: any) {
    return this.comboService.create(dto, req.user.empresaId);
  }

  @Get()
  findAll(@Query('filialId') filialId: string) {
    return this.comboService.findAll(filialId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('filialId') filialId: string) {
    return this.comboService.findOne(id, filialId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Query('filialId') filialId: string, @Body() dto: UpdateComboDto) {
    return this.comboService.update(id, filialId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('filialId') filialId: string) {
    return this.comboService.remove(id, filialId);
  }
}