import { IsString, MinLength } from 'class-validator';

export class UpdateSenhaDto {
  @IsString()
  @MinLength(6)
  senhaAtual!: string;

  @IsString()
  @MinLength(6)
  novaSenha!: string;
}