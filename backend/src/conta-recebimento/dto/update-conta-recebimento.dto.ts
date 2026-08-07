import { PartialType } from '@nestjs/mapped-types';
import { CreateContaRecebimentoDto } from './create-conta-recebimento.dto';

export class UpdateContaRecebimentoDto extends PartialType(CreateContaRecebimentoDto) {}
