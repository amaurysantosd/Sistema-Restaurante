import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AtendimentoModule } from '../atendimento/atendimento.module';
import { ChamadoController } from './chamado.controller';
import { ChamadoService } from './chamado.service';

@Module({
  imports: [PrismaModule, AtendimentoModule],
  controllers: [ChamadoController],
  providers: [ChamadoService],
})
export class ChamadoModule {}
