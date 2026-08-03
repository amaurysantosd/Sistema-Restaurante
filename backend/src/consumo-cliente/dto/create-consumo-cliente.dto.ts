import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateConsumoClienteDto {
  @IsUUID()
  @IsNotEmpty()
  produtoId!: string;

  @IsUUID()
  @IsNotEmpty()
  mesaId!: string;

  // Opcional -- default 1 se nao informado.
  @IsOptional()
  @IsInt()
  @Min(1)
  quantidade?: number;
}
