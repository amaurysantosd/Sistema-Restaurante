import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteAuthModule } from '../cliente-auth/cliente-auth.module';
import { HistoricoVisitaController } from './historico-visita.controller';
import { HistoricoVisitaService } from './historico-visita.service';

@Module({
  imports: [PrismaModule, ClienteAuthModule],
  controllers: [HistoricoVisitaController],
  providers: [HistoricoVisitaService],
  exports: [HistoricoVisitaService],
})
export class HistoricoVisitaModule {}
