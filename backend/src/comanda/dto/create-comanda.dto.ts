import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComandaDto {
  // Mesa onde a comanda sera aberta. Uma mesa pode ter varias comandas
  // abertas ao mesmo tempo (ex: comanda principal + convidado que paga
  // separado).
  @IsUUID()
  @IsNotEmpty()
  mesaId!: string;

  // Opcional -- tem default "Principal" no banco. Usado pra diferenciar
  // comandas na mesma mesa (ex: "Convidado 1").
  @IsOptional()
  @IsString()
  nome?: string;
}
