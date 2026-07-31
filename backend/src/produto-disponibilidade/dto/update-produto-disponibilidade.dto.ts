import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDisponibilidadeDto } from './create-produto-disponibilidade.dto';

export class UpdateProdutoDisponibilidadeDto extends PartialType(
  CreateProdutoDisponibilidadeDto,
) {}