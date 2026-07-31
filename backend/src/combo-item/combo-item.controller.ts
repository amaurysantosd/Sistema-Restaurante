import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ComboItemService } from './combo-item.service';
import { CreateComboItemDto } from './dto/create-combo-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('combo')
@UseGuards(JwtAuthGuard)
export class ComboItemController {
  constructor(private readonly comboItemService: ComboItemService) {}

  @Post(':comboId/item/:produtoId')
  adicionar(
    @Param('comboId') comboId: string,
    @Param('produtoId') produtoId: string,
    @Body() dto: CreateComboItemDto,
  ) {
    return this.comboItemService.adicionar(comboId, produtoId, dto);
  }

  @Get(':comboId/item')
  findAllByCombo(@Param('comboId') comboId: string) {
    return this.comboItemService.findAllByCombo(comboId);
  }

  @Delete('item/:id')
  remover(@Param('id') id: string) {
    return this.comboItemService.remover(id);
  }
}