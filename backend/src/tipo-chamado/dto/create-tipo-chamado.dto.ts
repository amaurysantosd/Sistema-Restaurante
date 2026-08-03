import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoChamadoDto {
  // Nome do tipo de chamado (ex: "Chamar Garcom", "Pedir Conta", ou qualquer
  // nome que o proprio estabelecimento queira criar). Obrigatorio.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Empresa a qual este tipo pertence. Cada empresa tem sua propria lista.
  @IsUUID()
  @IsNotEmpty()
  empresaId!: string;

  // Se o tipo esta ativo/disponivel para uso. Opcional, tem default no banco.
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
