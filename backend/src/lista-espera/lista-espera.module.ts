import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AtendimentoModule } from '../atendimento/atendimento.module';
import { ListaEsperaController } from './lista-espera.controller';
import { ListaEsperaService } from './lista-espera.service';

@Module({
  imports: [PrismaModule, AtendimentoModule],
  controllers: [ListaEsperaController],
  providers: [ListaEsperaService],
})
export class ListaEsperaModule {}
