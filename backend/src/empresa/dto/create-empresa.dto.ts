import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @IsString({ message: 'Digite um nome válido para a empresa' })
  @IsNotEmpty({ message: 'Nome Fantasia da Empresa é obrigatório'})
  nomeFantasia!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  cnpj!: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone!: string;

  @IsEmail({}, { message: 'Cadastre um e-mail válido' })
  email!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
