import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoMidiaDto } from './create-produto-midia.dto';

export class UpdateProdutoMidiaDto extends PartialType(CreateProdutoMidiaDto) {}