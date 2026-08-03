import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateChamadoDto {
  // Tipo do chamado (ex: "Chamar Garcom", "Pedir Conta") -- catalogo proprio
  // da empresa dona da mesa (TipoChamado). Validado no Service.
  @IsUUID()
  @IsNotEmpty()
  tipoChamadoId!: string;
}
