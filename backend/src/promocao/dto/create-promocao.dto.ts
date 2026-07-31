import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TipoDesconto } from '@prisma/client';

/**
 * Promocao = "o PRECO muda num periodo", sem afetar disponibilidade
 * (isso e responsabilidade de ProdutoDisponibilidade).
 *
 * Duas formas de vigencia, mutuamente exclusivas na pratica:
 * 1) Periodo absoluto: preencher dataInicio/dataFim, recorrente=false
 * 2) Recorrente: recorrente=true, preencher dias da semana + horaInicio/horaFim
 *    (dataInicio/dataFim sao ignorados quando recorrente=true)
 *
 * produtoVariacaoPrecoId e opcional: se vazio, a promocao vale para
 * TODAS as variacoes do produto; se preenchido, vale so para aquela
 * variacao especifica (ex: desconto so no "Litrao", nao na "Dose").
 */
export class CreatePromocaoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsEnum(TipoDesconto)
  tipoDesconto!: TipoDesconto;

  @IsNumber()
  valorDesconto!: number;

  // Periodo absoluto (usar quando recorrente=false)
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  // Recorrencia (usar quando recorrente=true)
  @IsOptional()
  @IsBoolean()
  recorrente?: boolean;

  @IsOptional() @IsBoolean() domingo?: boolean;
  @IsOptional() @IsBoolean() segunda?: boolean;
  @IsOptional() @IsBoolean() terca?: boolean;
  @IsOptional() @IsBoolean() quarta?: boolean;
  @IsOptional() @IsBoolean() quinta?: boolean;
  @IsOptional() @IsBoolean() sexta?: boolean;
  @IsOptional() @IsBoolean() sabado?: boolean;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFim?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsUUID()
  @IsNotEmpty()
  produtoId!: string;

  // Opcional -- se vazio, promocao vale para todas as variacoes do produto
  @IsOptional()
  @IsUUID()
  produtoVariacaoPrecoId?: string;
}