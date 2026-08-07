import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventoController],
  providers: [EventoService],
})
export class EventoModule {}
