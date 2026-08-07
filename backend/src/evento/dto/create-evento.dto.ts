import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { TipoEvento } from '@prisma/client';

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // PARTICULAR (bloqueia ambiente/filial inteiro) ou SAZONAL (informativo)
  @IsEnum(TipoEvento)
  tipo!: TipoEvento;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsDateString()
  dataInicio!: string;

  @IsDateString()
  dataFim!: string;

  // Pelo menos um dos dois deve vir preenchido -- validado no Service. Sem
  // nenhum dos dois nao haveria como isolar o evento por empresa (Evento nao
  // tem empresaId proprio no schema).
  @IsOptional()
  @IsUUID()
  filialId?: string;

  @IsOptional()
  @IsUUID()
  ambienteId?: string;

  @IsOptional()
  @IsNumber()
  valorEntrada?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
