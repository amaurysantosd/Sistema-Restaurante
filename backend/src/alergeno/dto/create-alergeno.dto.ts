import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateAlergenoDto {
  // Nome do alergeno (ex: "Gluten", "Lactose", "Amendoim"). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Empresa a qual este alergeno pertence. Cada empresa mantem seu proprio catalogo.
  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}