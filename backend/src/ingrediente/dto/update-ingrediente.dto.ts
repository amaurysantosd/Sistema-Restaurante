import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredienteDto } from './create-ingrediente.dto';

// Todos os campos se tornam opcionais, permitindo atualizacao parcial
export class UpdateIngredienteDto extends PartialType(CreateIngredienteDto) {}