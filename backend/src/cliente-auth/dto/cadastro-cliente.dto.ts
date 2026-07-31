import { IsString, IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber, IsBoolean } from 'class-validator';

/**
 * DTO do cadastro rapido/login do Cliente. Diferente de Usuario, nao tem
 * senha -- a identificacao e feita por telefone (obrigatorio) + email/cpf
 * (opcionais, usados so para complementar/evitar duplicidade).
 *
 * ATENCAO - pendencia de seguranca conhecida: sem verificacao (OTP via
 * SMS/WhatsApp), qualquer pessoa que souber o telefone de outro cliente
 * consegue "logar" como ele. Aceitavel em fase de desenvolvimento/teste;
 * deve ser resolvido antes de uso real com clientes de verdade.
 */
export class CadastroClienteDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Valida formato de telefone brasileiro (requer libphonenumber-js instalado)
  @IsPhoneNumber('BR')
  @IsNotEmpty()
  telefone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  // Consentimento SEPARADO para uso em marketing (WhatsApp, SMS, e-mail).
  // LGPD exige finalidade especifica -- nao pode ser implicito so por
  // ter se cadastrado. Default false: precisa ser marcado ativamente.
  @IsOptional()
  @IsBoolean()
  aceitaMarketing?: boolean;
}