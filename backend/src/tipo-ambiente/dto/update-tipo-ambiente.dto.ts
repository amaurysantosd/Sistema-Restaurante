import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoAmbienteDto } from './create-tipo-ambiente.dto';

// Todos os campos se tornam opcionais para permitir atualizacao parcial
export class UpdateTipoAmbienteDto extends PartialType(CreateTipoAmbienteDto) {}