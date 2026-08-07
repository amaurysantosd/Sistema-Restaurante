import {
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

// Usado na rota do CLIENTE (POST /reserva/minha) -- sem clienteId, que vem
// sempre do token, nunca do corpo. Ver CreateReservaStaffDto pra rota do staff.
export class CreateReservaDto {
  @IsDateString()
  dataHora!: string;

  @IsInt()
  @Min(1)
  quantidadePessoas!: number;

  @IsOptional()
  @IsString()
  observacoes?: string;

  // Preenchidos quando a reserva e feita sem Cliente cadastrado (rota do
  // staff, ex: reserva por telefone) -- na rota do cliente nao fazem sentido,
  // mas nao custa aceitar (o Service so usa quando nao ha clienteId).
  @IsOptional()
  @IsString()
  nomeConvidado?: string;

  @IsOptional()
  @IsString()
  telefoneConvidado?: string;

  // Orcamento opcional -- so gera calculo de sinal se preenchido
  @IsOptional()
  @IsNumber()
  valorOrcamento?: number;

  // Opcional -- se nao informado, usa Filial.reservaPercentualSinalPadrao
  @IsOptional()
  @IsNumber()
  percentualSinal?: number;

  @IsUUID()
  filialId!: string;

  @IsOptional()
  @IsUUID()
  ambienteId?: string;

  @IsOptional()
  @IsUUID()
  mesaId?: string;

  @IsOptional()
  @IsUUID()
  eventoId?: string;
}
