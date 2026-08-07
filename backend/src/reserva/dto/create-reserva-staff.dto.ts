import { IsOptional, IsUUID } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';

// Rota do STAFF (POST /reserva) -- unica diferenca e poder vincular a um
// Cliente ja cadastrado. Sem clienteId, usa nomeConvidado/telefoneConvidado
// (reserva por telefone, sem cadastro).
export class CreateReservaStaffDto extends CreateReservaDto {
  @IsOptional()
  @IsUUID()
  clienteId?: string;
}
