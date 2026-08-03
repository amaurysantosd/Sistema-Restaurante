import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateItemComandaDto {
  // Opcional -- default 1 se nao informado.
  @IsOptional()
  @IsInt()
  @Min(1)
  quantidade?: number;

  // EXATAMENTE UM entre produtoVariacaoPrecoId e comboId deve vir
  // preenchido -- validado no Service (XOR), o banco nao forca isso sozinho.
  @IsOptional()
  @IsUUID()
  produtoVariacaoPrecoId?: string;

  @IsOptional()
  @IsUUID()
  comboId?: string;
}
