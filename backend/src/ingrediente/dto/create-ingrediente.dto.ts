import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateIngredienteDto {
  // Nome do ingrediente (ex: "Bacon", "Queijo", "Cebola"). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Empresa a qual este ingrediente pertence. Cada empresa mantem seu proprio catalogo.
  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  // Se o ingrediente esta ativo/disponivel para uso em produtos. Opcional, tem default.
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}