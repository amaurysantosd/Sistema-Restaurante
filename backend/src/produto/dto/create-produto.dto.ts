import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateProdutoDto {
  // Nome do produto (ex: "Picanha na Brasa"). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Identificador amigavel para URL (ex: "picanha-na-brasa"). Obrigatorio.
  // Unico por filial (nao por sistema inteiro), conforme @@unique([filialId, slug]) no schema.
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  descricaoCurta?: string;

  // Tempo estimado de preparo, em minutos. Opcional.
  @IsOptional()
  @IsInt()
  tempoPreparo?: number;

  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @IsOptional()
  @IsInt()
  ordemExibicao?: number;

  // Campos especificos de bebida -- todos opcionais, pois nao se aplicam a comida
  @IsOptional()
  @IsBoolean()
  ehAlcoolico?: boolean;

  @IsOptional()
  @IsNumber()
  teorAlcoolico?: number;

  @IsOptional()
  @IsInt()
  ibu?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  // Filial a qual este produto pertence. Obrigatorio (cardapio e por filial).
  @IsUUID()
  @IsNotEmpty()
  filialId!: string;

  // Categoria do produto (ja existente no sistema). Obrigatorio.
  @IsUUID()
  @IsNotEmpty()
  categoriaId!: string;
}