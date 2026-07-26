import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
  IsBoolean,
} from 'class-validator';


export class CreateAmbienteDto {
  // Nome do ambiente (ex: "Salão Principal", "Varanda"). Obrigatório.
  @IsString()
  @IsNotEmpty()
  nome!: string;

  // Descrição extra, opcional (ex: detalhes sobre o ambiente)
  @IsOptional()
  @IsString()
  descricao?: string;

  // Agora referencia um TipoAmbiente cadastrado pela propria empresa,
  @IsUUID()
  @IsNotEmpty()
  tipoAmbienteId!: string;

  // Em qual andar o ambiente fica (0 = terreo, 1 = primeiro andar, etc).
  // Opcional, pois nem todo estabelecimento tem multiplos andares.
  @IsOptional()
  @IsInt()
  andar?: number;

  // Capacidade estimada de pessoas. Opcional.
  @IsOptional()
  @IsInt()
  capacidade?: number;

  // Filial a qual este ambiente pertence. Obrigatorio (isolamento multi-tenant).
  @IsUUID()
  @IsNotEmpty()
  filialId!: string;

  // Se o ambiente esta ativo/disponivel. Opcional, pois tem default: true no banco.
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}