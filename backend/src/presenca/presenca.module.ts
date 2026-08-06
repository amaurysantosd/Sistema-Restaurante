import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AtendimentoModule } from '../atendimento/atendimento.module';
import { PresencaController } from './presenca.controller';
import { PresencaService } from './presenca.service';

@Module({
  imports: [PrismaModule, AtendimentoModule],
  controllers: [PresencaController],
  providers: [PresencaService],
  exports: [PresencaService],
})
export class PresencaModule {}
