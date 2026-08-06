import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AtendimentoModule } from '../atendimento/atendimento.module';
import { HistoricoVisitaModule } from '../historico-visita/historico-visita.module';
import { PresencaController } from './presenca.controller';
import { PresencaService } from './presenca.service';

@Module({
  imports: [PrismaModule, AtendimentoModule, HistoricoVisitaModule],
  controllers: [PresencaController],
  providers: [PresencaService],
  exports: [PresencaService],
})
export class PresencaModule {}
