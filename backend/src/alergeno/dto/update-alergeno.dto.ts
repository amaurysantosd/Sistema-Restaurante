import { PartialType } from '@nestjs/mapped-types';
import { CreateAlergenoDto } from './create-alergeno.dto';

export class UpdateAlergenoDto extends PartialType(CreateAlergenoDto) {}