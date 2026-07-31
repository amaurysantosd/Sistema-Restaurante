import { IsBoolean, IsOptional, IsString, IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Uma REGRA de disponibilidade (dias + horario) para um produto.
 * Um produto pode ter varias regras (ex: seg-sex 18h-23h, sab-dom 12h-23h).
 * Sem nenhuma regra cadastrada, o produto e considerado sempre disponivel.
 */
export class CreateProdutoDisponibilidadeDto {
  @IsOptional() @IsBoolean() domingo?: boolean;
  @IsOptional() @IsBoolean() segunda?: boolean;
  @IsOptional() @IsBoolean() terca?: boolean;
  @IsOptional() @IsBoolean() quarta?: boolean;
  @IsOptional() @IsBoolean() quinta?: boolean;
  @IsOptional() @IsBoolean() sexta?: boolean;
  @IsOptional() @IsBoolean() sabado?: boolean;

  // Horario no formato HH:mm (ex: "18:00"). Obrigatorios -- uma regra sem
  // horario nao faz sentido existir.
  @IsString()
  @IsNotEmpty()
  horaInicio!: string;

  @IsString()
  @IsNotEmpty()
  horaFim!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsUUID()
  @IsNotEmpty()
  produtoId!: string;
}