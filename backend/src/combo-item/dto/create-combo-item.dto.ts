import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * ComboItem tem um campo proprio (quantidade), diferente dos outros modulos
 * de juncao (ProdutoIngrediente, ProdutoTag) que nao tinham nenhum campo
 * alem dos IDs. Por isso, aqui faz sentido ter um DTO pequeno so para
 * validar a quantidade -- os IDs (comboId, produtoId) continuam vindo
 * pela URL, nao pelo corpo.
 */
export class CreateComboItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantidade?: number;
}