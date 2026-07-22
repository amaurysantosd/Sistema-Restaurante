import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Perfil } from '@prisma/client';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsEnum(Perfil)
  perfil!: Perfil;

  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  @IsOptional()
  @IsUUID()
  filialId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}