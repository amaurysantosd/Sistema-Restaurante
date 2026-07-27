import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID, IsBoolean } from 'class-validator';

export class CreateMesaDto {
  // Identificacao da mesa (ex: "5", "VIP-1", "12A"). Texto livre, obrigatorio.
  @IsString()
  @IsNotEmpty()
  numero!: string;

  // Capacidade estimada de pessoas na mesa. Opcional.
  @IsOptional()
  @IsInt()
  capacidade?: number;

  // Ambiente ao qual esta mesa pertence. Obrigatorio.
  @IsUUID()
  @IsNotEmpty()
  ambienteId!: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  // Repare: NAO existe campo qrCode aqui. Ele e gerado pelo servidor,
  // nunca informado pelo cliente da API (evita QR Code previsivel/escolhido).
}