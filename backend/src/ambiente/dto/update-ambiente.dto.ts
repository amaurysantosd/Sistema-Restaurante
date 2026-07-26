import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbienteDto } from './create-ambiente.dto';

// PartialType pega todos os campos de CreateAmbienteDto e os torna opcionais.
// Faz sentido para update: numa edicao (PATCH), a pessoa pode querer mudar
// so um campo (ex: so a capacidade), sem reenviar tudo de novo.
/* O PartialType funciona em tempo de execução (runtime). Ele cria uma nova classe
em memória, baseada na classe CreateAmbienteDto, mas com todos os atributos opcionais. */
export class UpdateAmbienteDto extends PartialType(CreateAmbienteDto) {}