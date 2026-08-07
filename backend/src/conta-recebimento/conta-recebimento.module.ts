import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContaRecebimentoController } from './conta-recebimento.controller';
import { ContaRecebimentoService } from './conta-recebimento.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContaRecebimentoController],
  providers: [ContaRecebimentoService],
})
export class ContaRecebimentoModule {}
