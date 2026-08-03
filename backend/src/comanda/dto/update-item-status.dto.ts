import { IsEnum } from 'class-validator';
import { StatusItemComanda } from '@prisma/client';

export class UpdateItemStatusDto {
  @IsEnum(StatusItemComanda)
  status!: StatusItemComanda;
}
