import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoChamadoDto } from './create-tipo-chamado.dto';

// Todos os campos se tornam opcionais para permitir atualizacao parcial
export class UpdateTipoChamadoDto extends PartialType(CreateTipoChamadoDto) {}
