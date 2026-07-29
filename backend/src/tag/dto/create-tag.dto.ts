import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateTagDto {
  // Nome da tag (ex: "Familia", "Individual", "+18", "Vegano"). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Empresa a qual esta tag pertence. Cada empresa mantem seu proprio catalogo.
  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}