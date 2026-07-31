import { PartialType } from '@nestjs/mapped-types';
import { CreateRestricaoAlimentarDto } from './create-restricao-alimentar.dto';

export class UpdateRestricaoAlimentarDto extends PartialType(CreateRestricaoAlimentarDto) {}