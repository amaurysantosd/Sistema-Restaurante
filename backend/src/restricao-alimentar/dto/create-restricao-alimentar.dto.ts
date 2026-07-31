import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

/**
 * RestricaoAlimentar e um catalogo GLOBAL da plataforma (nao por empresa,
 * diferente de Alergeno) -- restricao alimentar e caracteristica pessoal
 * do cliente (vegano, sem gluten), nao muda conforme o estabelecimento.
 * Mantido pela administracao da plataforma, nao pelo estabelecimento.
 */
export class CreateRestricaoAlimentarDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}