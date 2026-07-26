import { Module } from '@nestjs/common';
import { TipoAmbienteController } from './tipo-ambiente.controller';
import { TipoAmbienteService } from './tipo-ambiente.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoAmbienteController],
  providers: [TipoAmbienteService],
})
export class TipoAmbienteModule {}