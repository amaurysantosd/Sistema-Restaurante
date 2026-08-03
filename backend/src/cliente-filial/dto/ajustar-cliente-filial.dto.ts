import { IsInt, IsNumber, IsOptional } from 'class-validator';

// Ajuste incremental: valores positivos creditam, negativos debitam.
// Pelo menos um dos dois campos deve vir preenchido -- validado no Service,
// já que class-validator não expressa bem "ao menos um destes dois".
export class AjustarClienteFilialDto {
  @IsOptional()
  @IsInt()
  pontos?: number;

  @IsOptional()
  @IsNumber()
  cashback?: number;
}
