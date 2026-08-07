import { IsInt, Min, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateListaEsperaDto {
  @IsInt()
  @Min(1)
  quantidadePessoas!: number;

  @IsOptional()
  @IsString()
  nomeConvidado?: string;

  @IsOptional()
  @IsString()
  telefoneConvidado?: string;

  // Se o grupo tiver um Cliente cadastrado -- opcional, staff pode so
  // anotar nome/telefone pra quem chegou sem cadastro.
  @IsOptional()
  @IsUUID()
  clienteId?: string;

  @IsUUID()
  filialId!: string;
}
