import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DestinoPreparo } from '@prisma/client';

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

  // COZINHA ou BAR -- destino padrao dos produtos desta categoria (Fase 4).
  // Opcional aqui porque tem default no banco (COZINHA).
  @IsOptional()
  @IsEnum(DestinoPreparo)
  destinoPadrao?: DestinoPreparo;
}
