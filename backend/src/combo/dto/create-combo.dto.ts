import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID } from 'class-validator';

/**
 * Combo = combinacao de PRODUTOS DISTINTOS vendidos juntos com preco proprio
 * (ex: "Litro de Whisky + 3 Red Bull"). Diferente de ProdutoVariacaoPreco,
 * que e so uma forma diferente de vender O MESMO produto (Dose vs Litro).
 *
 * O Combo em si so tem os dados do pacote (nome, preco). Os produtos que o
 * compoem sao adicionados depois, via ComboItem (rota separada) -- assim o
 * sistema sabe exatamente quais produtos (e em que quantidade) sao
 * consumidos do estoque quando o combo e vendido.
 */
export class CreateComboDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  preco!: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsUUID()
  @IsNotEmpty()
  filialId!: string;
}