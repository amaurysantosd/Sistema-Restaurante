import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoVariacaoPrecoDto } from './create-produto-variacao-preco.dto';

export class UpdateProdutoVariacaoPrecoDto extends PartialType(CreateProdutoVariacaoPrecoDto) {}