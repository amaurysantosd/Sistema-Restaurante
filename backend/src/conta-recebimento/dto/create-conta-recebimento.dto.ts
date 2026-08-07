import { IsEnum, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { FinalidadeRecebimento } from '@prisma/client';

export class CreateContaRecebimentoDto {
  // COMANDA/RESERVA/EVENTO/GERAL -- @@unique([empresaId, finalidade]) no
  // schema garante uma conta por finalidade por empresa
  @IsEnum(FinalidadeRecebimento)
  finalidade!: FinalidadeRecebimento;

  @IsString()
  @IsNotEmpty()
  chavePix!: string;

  @IsString()
  @IsNotEmpty()
  nomeFavorecido!: string;

  @IsOptional()
  @IsString()
  nomeBanco?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
