import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateProdutoVariacaoPrecoDto {
  // Nome da variacao (ex: "Preco 1", "Dose", "Garrafa", "Vodka Smirnoff"). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Detalhe extra opcional (ex: "vodka mais barata, frutas e energetico mais em conta")
  @IsOptional()
  @IsString()
  descricao?: string;

  // Preco desta variacao especifica. Obrigatorio.
  @IsNumber()
  preco!: number;

  // Se esta variacao deve ser a exibida em destaque no cardapio. Opcional
  // (default false) -- o Service garante que so uma fique true por produto.
  @IsOptional()
  @IsBoolean()
  principal?: boolean;

  @IsOptional()
  @IsInt()
  ordem?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  // Produto ao qual esta variacao pertence. Obrigatorio.
  @IsUUID()
  @IsNotEmpty()
  produtoId!: string;
}