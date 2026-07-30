import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { TipoMidia } from '@prisma/client';

/**
 * ProdutoMidia — galeria de fotos/videos do produto.
 * Suporta multiplas midias por produto (estilo Stories do ClipFood),
 * com ordem de exibicao e uma marcada como "principal" (capa do produto).
 * O Service garante que so uma midia fique principal=true por produto.
 */
export class CreateProdutoMidiaDto {
  // FOTO ou VIDEO -- ver enum TipoMidia no schema
  @IsEnum(TipoMidia)
  tipo!: TipoMidia;

  // URL onde a midia esta hospedada
  @IsString()
  @IsNotEmpty()
  url!: string;

  // Miniatura estatica, especialmente util para videos (mostra antes de tocar)
  @IsOptional()
  @IsString()
  thumbnail?: string;

  // Posicao na galeria (0 = primeira). Opcional, tem default no banco.
  @IsOptional()
  @IsInt()
  ordem?: number;

  // Se esta midia deve ser a capa/destaque do produto. Opcional (default false)
  // -- o Service garante que so uma fique true por produto.
  @IsOptional()
  @IsBoolean()
  principal?: boolean;

  // Produto ao qual esta midia pertence. Obrigatorio.
  @IsUUID()
  @IsNotEmpty()
  produtoId!: string;
}