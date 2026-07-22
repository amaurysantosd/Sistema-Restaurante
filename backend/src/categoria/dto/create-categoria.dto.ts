import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

/* Camada de validação (DTOs) - quais campos uma requisição pode ter e quais regras eles seguem  */
export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
